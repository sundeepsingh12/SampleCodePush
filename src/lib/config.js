module.exports = {
  SESSION_TOKEN_KEY: 'SESSION_TOKEN_KEY',
  APP_FOLDER: 'FAREYE',
  SYNC_SERVICE_DELAY: 120000,
  intervalId: 0,
  backend: {
    fareyeProduction: false,
    fareyeStaging: true
  },
  FAREYE: {
    production: {
      url: 'https://www.fareye.co'
    },
    staging: {
      url: 'https://dev.fareye.co'
    },
    port: 8083,
    PUSH_QOS: 2
  },
  API: {
    AUTHENTICATION_API: '/app/authentication',
    JOB_MASTER_API: '/app/app/rest/device/job_master',
    CHECK_ASSET_API: '/app/rest/device/check_asset',
    GENERATE_OTP_API: '/app/rest/device/generate_otp',
    SIM_VERIFICATION_API: '/app/rest/device/sim_verified',
    LOGOUT_API: '/app/logout',
    DOWNLOAD_DATA_API: '/app/rest/device/get_sync_table_job_with_pagination',
    DELETE_DATA_API: '/app/rest/device/delete_synch_job',
    PUSH_BROKER: 'mqttdev.fareye.co',
    UPLOAD_DATA_API: '/app/rest/device/sync',
    SEQUENCE_USING_ROUTING_API: '/app/rest/order/sequence_using_routing',
    SERVICE_DSA: "/app/rest/data_search_api",
    GET_SEQUENCE_NEXT_COUNT: '/app/rest/get_sequence_next_count',
    SERVICE_RESET_PASSWORD: '/app/rest/users/password',
    SCAN_AND_SEARCH_SORTING: '/app/rest/job/search_reference_no',
    POST_ASSIGNMENT_FORCE_ASSIGN_API: '/app/rest/device/assign_scanned_job',
    DOWNLOAD_LIVE_JOB_DATA: '/app/rest/device/get_sync_table_live_job_with_pagination',
    SERVICE_ALERT_JOB: '/app/rest/device/broadcast_job_confirmation',
    SERVICE_ALERT_JOB_MULTIPLE: '/app/rest/device/broadcast_job_confirmation_multiple',
    SERVICE_DSA_EXTERNAL: '/app/rest/data_search_api_for_external_data_store',
    FORGET_PASSWORD: '/forgot_password/send_link_device'
  }
}
