export interface SideNavInterface {
    path: string;
    title: string;
    iconType: "" | "nzIcon" | "fontawesome";
    iconTheme?:  "fill" | "outline" | "twotone";
    icon: string,
    submenu : SideNavInterface[];
}
