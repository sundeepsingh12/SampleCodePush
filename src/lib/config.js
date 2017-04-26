module.exports = {
  SESSION_TOKEN_KEY: 'SESSION_TOKEN_KEY',
  
  backend: {
    fareyeProduction: false,
    fareyeStaging: true
  },
  FAREYE: {
    production: {
      url: 'https://www.fareye.co/app'
    },
    staging: {
      url: 'https://staging.fareye.co/app'
    }
  },
    API:{
        JOB_MASTER_API:'/rest/device/job_master',
        CHECK_ASSET_API :'/rest/device/check_asset',
        SIM_VERIFY_API :'/rest/device/generate_otp'

    }
}
