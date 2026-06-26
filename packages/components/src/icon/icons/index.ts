import type { Component } from 'vue'
import AddIcon from './add.vue'
import BackIcon from './back.vue'
import CalendarIcon from './calendar.vue'
import ChartIcon from './chart.vue'
import CheckIcon from './check.vue'
import CloseIcon from './close.vue'
import CopyIcon from './copy.vue'
import DashboardIcon from './dashboard.vue'
import DatabaseIcon from './database.vue'
import DeleteIcon from './delete.vue'
import DownloadIcon from './download.vue'
import EditIcon from './edit.vue'
import ErrorIcon from './error.vue'
import ExportIcon from './export.vue'
import EyeCloseIcon from './eye-close.vue'
import EyeOpenIcon from './eye-open.vue'
import FileIcon from './file.vue'
import FilterIcon from './filter.vue'
import FolderIcon from './folder.vue'
import HomeIcon from './home.vue'
import InfoIcon from './info.vue'
import LeftIcon from './left.vue'
import ListIcon from './list.vue'
import LoadingIcon from './loading.vue'
import LockIcon from './lock.vue'
import MenuIcon from './menu.vue'
import PermissionIcon from './permission.vue'
import RefreshIcon from './refresh.vue'
import RightIcon from './right.vue'
import RoleIcon from './role.vue'
import SaveIcon from './save.vue'
import SearchIcon from './search.vue'
import SettingIcon from './setting.vue'
import SortIcon from './sort.vue'
import SuccessIcon from './success.vue'
import TableIcon from './table.vue'
import TimeIcon from './time.vue'
import UnlockIcon from './unlock.vue'
import UploadIcon from './upload.vue'
import UserIcon from './user.vue'
import WarningIcon from './warning.vue'

export const iconMap = {
  add: AddIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  save: SaveIcon,
  search: SearchIcon,
  refresh: RefreshIcon,
  upload: UploadIcon,
  download: DownloadIcon,
  copy: CopyIcon,
  export: ExportIcon,
  home: HomeIcon,
  menu: MenuIcon,
  setting: SettingIcon,
  user: UserIcon,
  role: RoleIcon,
  permission: PermissionIcon,
  dashboard: DashboardIcon,
  back: BackIcon,
  left: LeftIcon,
  right: RightIcon,
  table: TableIcon,
  list: ListIcon,
  chart: ChartIcon,
  database: DatabaseIcon,
  file: FileIcon,
  folder: FolderIcon,
  filter: FilterIcon,
  sort: SortIcon,
  calendar: CalendarIcon,
  time: TimeIcon,
  check: CheckIcon,
  close: CloseIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  success: SuccessIcon,
  loading: LoadingIcon,
  lock: LockIcon,
  unlock: UnlockIcon,
  'eye-open': EyeOpenIcon,
  'eye-close': EyeCloseIcon
} satisfies Record<string, Component>

export type IconName = keyof typeof iconMap

export const iconAliases: Record<string, IconName> = {
  view: 'eye-open'
}

export function resolveIconName(name: string): IconName {
  const normalizedName = iconAliases[name] ?? name

  if (normalizedName in iconMap) {
    return normalizedName as IconName
  }

  return 'close'
}

export function getIconComponent(name: string): Component {
  return iconMap[resolveIconName(name)]
}
