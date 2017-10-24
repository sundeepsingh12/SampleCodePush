module.exports = {
  SESSION_TOKEN_KEY: 'SESSION_TOKEN_KEY',
  APP_FOLDER: 'FAREYE',
  SYNC_SERVICE_DELAY:120000,
  intervalId:0,
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
    },
    port:1883,
    PUSH_QOS:2
    },
  API: {
    AUTHENTICATION_API: '/authentication',
    JOB_MASTER_API: '/rest/device/job_master',
    CHECK_ASSET_API: '/rest/device/check_asset',
    GENERATE_OTP_API: '/rest/device/generate_otp',
    SIM_VERIFICATION_API: '/rest/device/sim_verified',
    LOGOUT_API: '/logout',
    DOWNLOAD_DATA_API: '/rest/device/get_sync_table_job_with_pagination',
    DELETE_DATA_API: '/rest/device/delete_synch_job',
    PUSH_BROKER:'mqttdev.fareye.co',
    UPLOAD_DATA_API : '/rest/device/sync'
  }
}
