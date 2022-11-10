import {SideNavInterface} from '../../interfaces/side-nav.type';

export const ROUTES: SideNavInterface[] = [
    {
      path: '',
      title: 'Staff',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      toolTip: 'Add, Edit or View All staff members',
      icon: 'user',
      submenu: [
        {
          path: 'staff/add',
          title: 'Add Staff Member',
          iconType: '',
          icon: '',
          submenu: [],
          iconTheme: 'fill',
        }, {
            path: 'staff/view',
            title: 'View Staff Members',
            iconType: '',
            icon: '',
            submenu: [],
            iconTheme: "fill"
          },
        ]
    },
  {
    path: 'prospects',
    title: 'Prospects',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: 'team',
    toolTip: 'Add, Edit , Delete and View All prospects',
    submenu: [
      // {
      //   path: 'prospect/add',
      //   title: 'Add Prospect',
      //   iconType: '',
      //   icon: '',
      //   iconTheme: 'fill',
      //   submenu: []
      // },
      // {
      //   path: 'prospect/view',
      //   title: 'View Prospects',
      //   iconType: '',
      //   icon: '',
      //   iconTheme: 'fill',
      //   submenu: []
      // },
    ]
  }, {
    path: 'traits',
    title: 'Traits',
    toolTip: 'Add, Edit or View All Traits',
    iconTheme: 'fill',
    submenu: [],
    icon: 'trophy',
    iconType: 'nzIcon'
  }

]
