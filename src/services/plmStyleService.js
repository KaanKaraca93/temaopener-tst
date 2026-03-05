const axios = require('axios');
const tokenService = require('./tokenService');
const PLM_CONFIG = require('../config/plm.config');

/**
 * PLM Style Service
 * Style bilgilerini çeker ve günceller
 */
class PlmStyleService {
  
  /**
   * PLM'den style bilgisi çek
   * @param {number} styleId - Style ID
   * @returns {Promise<Object>} Style bilgisi
   */
  async getStyle(styleId) {
    try {
      const authHeader = await tokenService.getAuthorizationHeader();
      
      const url = `${PLM_CONFIG.ionApiUrl}/${PLM_CONFIG.tenantId}/FASHIONPLM/odata2/api/odata2/STYLE`;
      const params = {
        '$filter': `StyleId eq ${styleId}`,
        '$select': 'StyleId,Status,ThemeId'
      };
      
      console.log(`📞 Style bilgisi çekiliyor: StyleId=${styleId}`);
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        params: params
      });
      
      if (response.data && response.data.value && response.data.value.length > 0) {
        const style = response.data.value[0];
        console.log(`✅ Style ${styleId}: Status=${style.Status}, ThemeId=${style.ThemeId}`);
        return style;
      }
      
      console.log(`⚠️  Style ${styleId} bulunamadı`);
      return null;
      
    } catch (error) {
      console.error(`❌ Style ${styleId} çekme hatası:`, error.message);
      throw error;
    }
  }

  /**
   * PLM'den style bilgisini colorwaylar ile birlikte çek
   * @param {number} styleId - Style ID
   * @returns {Promise<Object>} Style ve colorway bilgileri
   */
  async getStyleWithColorways(styleId) {
    try {
      const authHeader = await tokenService.getAuthorizationHeader();
      
      const url = `${PLM_CONFIG.ionApiUrl}/${PLM_CONFIG.tenantId}/FASHIONPLM/odata2/api/odata2/STYLE`;
      const params = {
        '$filter': `StyleId eq ${styleId}`,
        '$select': 'StyleId,Status,ThemeId',
        '$expand': 'StyleColorways($expand=Theme($select=Name,Code,Description);$select=StyleColorwayId,StyleId,ColorrngId,Code,Name,HexValue,ThemeId,ColorwayStatus)'
      };
      
      console.log(`📞 Style ve colorway bilgileri çekiliyor: StyleId=${styleId}`);
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        params: params
      });
      
      if (response.data && response.data.value && response.data.value.length > 0) {
        const style = response.data.value[0];
        
        // Colorway verilerini parse et
        const colorways = (style.StyleColorways || []).map(colorway => ({
          StyleColorwayId: colorway.StyleColorwayId,
          StyleId: colorway.StyleId,
          ColorrngId: colorway.ColorrngId,
          ColorwayCode: colorway.Code,
          ColorwayName: colorway.Name,
          HexValue: colorway.HexValue,
          ThemeId: colorway.ThemeId,
          ColorwayStatus: colorway.ColorwayStatus,
          Theme: colorway.Theme ? {
            Name: colorway.Theme.Name,
            Code: colorway.Theme.Code,
            Description: colorway.Theme.Description
          } : null
        }));
        
        console.log(`✅ Style ${styleId}: Status=${style.Status}, ThemeId=${style.ThemeId}, Colorway sayısı: ${colorways.length}`);
        
        return {
          styleInfo: {
            StyleId: style.StyleId,
            Status: style.Status,
            ThemeId: style.ThemeId
          },
          colorways: colorways
        };
      }
      
      console.log(`⚠️  Style ${styleId} bulunamadı`);
      return null;
      
    } catch (error) {
      console.error(`❌ Style ${styleId} çekme hatası:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  /**
   * PLM'de style güncelle (PATCH)
   * @param {number} styleId - Style ID
   * @param {Object} updates - Güncellenecek alanlar (ThemeId, Status)
   * @returns {Promise<Object>} Güncelleme sonucu
   */
  async patchStyle(styleId, updates) {
    try {
      const authHeader = await tokenService.getAuthorizationHeader();
      
      const url = `${PLM_CONFIG.ionApiUrl}/${PLM_CONFIG.tenantId}/FASHIONPLM/odata2/api/odata2/STYLE(${styleId})`;
      
      console.log(`📤 Style ${styleId} güncelleniyor...`);
      console.log(`📦 Payload:`, JSON.stringify(updates, null, 2));
      
      const response = await axios.patch(url, updates, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ Style ${styleId} güncellendi - Status: ${response.status}`);
      
      return {
        success: true,
        statusCode: response.status,
        styleId: styleId,
        updates: updates
      };
      
    } catch (error) {
      console.error(`❌ Style ${styleId} güncelleme hatası:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  /**
   * Style için sync işlemi tetikle
   * @param {number} styleId - Style ID
   * @returns {Promise<Object>} Sync sonucu
   */
  async syncStyle(styleId) {
    try {
      const authHeader = await tokenService.getAuthorizationHeader();
      
      const url = `${PLM_CONFIG.ionApiUrl}/${PLM_CONFIG.tenantId}/FASHIONPLM/job/api/job/tasks`;
      
      // TEST repository - always use FSH4 schema
      const schema = 'FSH4';
      
      const payload = {
        TaskId: 'syncSearchData',
        IsSystem: true,
        CustomData: [
          {
            key: 'cluster',
            value: 'styleoverview'
          },
          {
            key: 'moduleId',
            value: styleId
          },
          {
            key: 'schema',
            value: schema
          },
          {
            key: 'updateOrgLevelPath',
            value: 'true'
          }
        ],
        Sequence: 1
      };
      
      console.log(`🔄 Style ${styleId} için sync başlatılıyor (${schema})...`);
      
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`✅ Sync başarılı - Style ${styleId}`);
      
      return {
        success: true,
        statusCode: response.status,
        styleId: styleId,
        schema: schema
      };
      
    } catch (error) {
      console.error(`❌ Style ${styleId} sync hatası:`, error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }
}

// Create singleton instance
const plmStyleService = new PlmStyleService();

module.exports = plmStyleService;
