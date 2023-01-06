import {SideNavInterface} from '../../interfaces/side-nav.type';
import {Permissions} from '../../enums/permissions';

export const ROUTES: SideNavInterface[] = [
  {
    path: '',
    title: 'Staff',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'user',
    permission: [
      Permissions.clubAdmin,
      Permissions.CreateGradeProspects,
      Permissions.GradeProspects,
      Permissions.ViewOnly,
      Permissions.CreateProspects,
    ],
    submenu: [
      {
        path: 'staff/add',
        title: 'Add Staff Member',
        iconType: '',
        icon: '',
        submenu: [],
        iconTheme: 'fill',
        permission: [
          Permissions.clubAdmin
        ]
      },
      {
        path: 'staff/view',
        title: 'View Staff Members',
        iconType: '',
        icon: '',
        submenu: [],
        iconTheme: 'fill',
        permission: [
          Permissions.clubAdmin,
          Permissions.CreateGradeProspects,
          Permissions.GradeProspects,
          Permissions.ViewOnly,
          Permissions.CreateProspects,
        ]
      },
    ],
  },
  {
    path: 'prospects',
    title: 'Prospects',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'team',
    submenu: [],
    permission: [
      Permissions.clubAdmin,
      Permissions.CreateGradeProspects,
      Permissions.GradeProspects,
      Permissions.ViewOnly,
      Permissions.CreateProspects,
    ]
  },
  {
    path: 'traits',
    title: 'Traits',
    iconTheme: 'fill',
    submenu: [],
    icon: 'trophy',
    iconType: 'nzIcon',
    permission: [
      Permissions.clubAdmin,
      Permissions.CreateGradeProspects,
      Permissions.GradeProspects,
      Permissions.ViewOnly,
      Permissions.CreateProspects,
    ]
  },
  {
    path: 'grade',
    title: 'Grade',
    iconTheme: 'fill',
    submenu: [],
    icon: 'trophy',
    iconType: 'svg',
    permission: [
      Permissions.clubAdmin,
      Permissions.CreateGradeProspects,
      Permissions.GradeProspects,
    ]
  },
  {
    path: '',
    title: 'Report',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'dot-chart',
    permission: [
      Permissions.clubAdmin,
      Permissions.CreateGradeProspects,
      Permissions.GradeProspects,
      Permissions.ViewOnly,
      Permissions.CreateProspects,
    ],
    submenu: [
      {
        path: 'report',
        title: 'Trajectory Report',
        iconType: '',
        icon: '',
        submenu: [],
        iconTheme: 'fill',
        permission: [
          Permissions.clubAdmin,
          Permissions.CreateGradeProspects,
          Permissions.GradeProspects,
          Permissions.ViewOnly,
          Permissions.CreateProspects,
        ]
      },
    ],
  },

];
