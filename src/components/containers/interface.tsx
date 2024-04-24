export interface mainItem {
    id: number;
    code: string;
    text: string;
    icon: string;
    sort: number;
    url: string;
    component: string;
    subItems: SubItem[];
    permission: [];
  }

  interface SubItem {
    id: number;
    code: string;
    text: string;
    icon: string;
    sort: number;
    url: string;
    component: string;
    subItems: SubItem[];
    permission: [];
  }