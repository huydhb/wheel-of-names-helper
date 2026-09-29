/** Supported domains for wheel manipulation */
export const SUPPORTED_DOMAINS = [
  'wheelofnames.com',
  'wheelrandom.com',
  'spinthewheel.io',
] as const;

/** Chrome storage keys */
export const STORAGE_KEYS = {
  TARGET_NAMES: 'targetNames',
  IS_ACTIVE: 'isActive',
} as const;

/** Local storage key in web page context */
export const PAGE_STORAGE_KEY = 'ufs_wheel_target_names';

/** Message actions between popup and content scripts */
export const EXT_ACTIONS = {
  START: 'start_hack',
  STOP: 'stop_hack',
  GET_STATUS: 'get_status',
} as const;

/** Window message types between content and inject script */
export const PAGE_MSG = {
  START_HACK: 'UFS_START_HACK',
  STOP_HACK: 'UFS_STOP_HACK',
  GET_STATUS: 'UFS_GET_STATUS',
  STATUS_UPDATE: 'UFS_STATUS_UPDATE',
} as const;
