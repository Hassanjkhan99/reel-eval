export interface SideNavInterface {
  path: string;
  title: string;
  iconType: "" | "nzIcon" | "fontawesome" | "svg";
  iconTheme: "" | "fab" | "far" | "fas" | "fill" | "outline" | "twotone";
  icon: string,
  submenu: SideNavInterface[];
  toolTip?: string
  permission: number[]
}
