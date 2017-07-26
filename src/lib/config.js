module.exports = {
  SESSION_TOKEN_KEY: 'SESSION_TOKEN_KEY',
  APP_FOLDER: 'FAREYE',

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
    // staging: {
    //   url: 'http://192.168.1.169:8080/app'
    // }

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
    UPLOAD_DATA_API : '/rest/device/sync'
  }
}
