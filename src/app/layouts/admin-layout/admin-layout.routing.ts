import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
// administrator module
import { RoleComponent } from '../../pages/administrator/roles/role.component';
import { AssignUserRoleComponent } from '../../pages/administrator/assign-user-role/assign-user-role.component';
import { UserManageComponent } from '../../pages/administrator/user-manages/user-manage.component';
import { BranchManageComponent } from '../../pages/administrator/branch-manage/branch-manage.component';
// system module
import { SystemRoleComponent } from '../../pages/system-manage/system-roles/system-role.component';
import { SystemUserComponent } from '../../pages/system-manage/system-user/system-user.component';
import { SystemUserRoleComponent } from '../../pages/system-manage/system-user-role/system-user-role.component';
import { TeamSetupComponent } from '../../pages/system-manage/team-setup/team-setup.component';
// data collector module
import { DcFormComponent } from '../../pages/data-collector/dc-form/dc-form.component';
import { QcPropertyListComponent } from '../../pages/data-collector/qc-property-lists/qc-property-list.component';
import { ApproveListingComponent } from '../../pages/data-collector/approve-listing/approve-listing.component';
// website listing
import {AddToWebsiteComponent} from '../../pages/website-listing/add-to-website/add-to-website.component';
import {WebsiteLandSaleComponent} from '../../pages/website-listing/website-land-sale/website-land-sale.component';
import {WebsiteSalePropertyListComponent} from '../../pages/website-listing/website-sale-list/website-sale-property-list.component';
import {WebsiteRentPropertyListComponent} from '../../pages/website-listing/website-rent-list/website-rent-property-list.component';
import {WebsiteLandSaleListComponent} from '../../pages/website-listing/website-land-sale-list/website-land-sale-property-list.component';

// property manage
import {ForSaleComponent} from '../../pages/property-manage/for-sale/for-sale.component';
import {ForRentComponent} from '../../pages/property-manage/for-rent/for-rent.component';
import {ForLandSaleComponent} from '../../pages/property-manage/for-land-sale/for-land-sale.component';
// property Qc Sale manage
import {FSQcPropertyListComponent} from '../../pages/property-manage/for-sale-qc-property-list/for-sale-qc-property-list.component';
// property Qc Rent manage
import {FRQcPropertyListComponent} from '../../pages/property-manage/for-rent-qc-property-list/for-rent-qc-property-list.component';
// property Qc Land Sale manage
import {FLSQcPropertyListComponent} from '../../pages/property-manage/for-land-sale-qc-property-list/for-land-sale-qc-property-list.component';
// property Approve for sale listing
import {FSApproveListingComponent} from '../../pages/property-manage/approve-listing/for-sales/for-sales-approve-listing.component';
import {FRApproveListingComponent} from '../../pages/property-manage/approve-listing/for-rent/for-rent-approve-listing.component';
import {FLSApproveListingComponent} from '../../pages/property-manage/approve-listing/for-land-sales/for-land-sale-approve-listing.component';
// property Manage Product for sale listing
import {ProductComponent} from '../../pages/property-manage/product/product.component';
import {RentProductComponent} from '../../pages/property-manage/product/rent-product/rent-product.component';
import {LandSaleProductComponent} from '../../pages/property-manage/product/land-sale-product/land-sale-product.component';
// Reassign property Manage Product for sale listing
import { FSReassignPropertyComponent } from '../../pages/property-manage/reassign-property/for-sales/for-sales-reassign-property.component';
import { FRReassignPropertyComponent } from '../../pages/property-manage/reassign-property/for-rent/for-rent-reassign-property.component';
import { FLSReassignPropertyComponent } from '../../pages/property-manage/reassign-property/for-land-sales/for-land-sale-reassign-property.component';

// Lead Manage
import { NewLeadComponent } from '../../pages/leads/new-lead/new-lead.component';
import { EditLeadComponent } from '../../pages/leads/edit-lead/edit-lead.component';
import {ManageLeadComponent} from '../../pages/leads/manage-lead/manage-lead.component';
import { TodolistComponent } from '../../pages/leads/todolist/todolist.component';
import {CalenderComponent} from '../../pages/leads/calender/calender.component';
import { SearchLeadComponent } from '../../pages/leads/search-lead/search-lead.component';
import {TokenPaymentComponent} from '../../pages/leads/token-payment/token-payment.component';
import {ShareLeadComponent} from '../../pages/leads/share-lead/share-lead.component';
import {NotificationComponent} from '../../pages/leads/notification/notification.component';


// System settings
import { SystemSettingsComponent } from '../../pages/system-settings/system-settings.component';

import { BannerSectionComponent } from '../../pages/add-property/banner-section/banner-section.component';
import { HowItWorkComponent } from '../../pages/add-property/how-it-work/how-it-work.component';
import { CustomerExperiencesComponent } from '../../pages/add-property/customer-experiences/customer-experiences.component';
import { FaqComponent } from '../../pages/add-property/faq/faq.component';

import { BlogBannerComponent } from '../../pages/blog/banner-manage/banner-manage.component';
import { BlogCategoryComponent } from '../../pages/blog/blog-category/category-manage.component';
import { BlogManageComponent } from '../../pages/blog/blog-manage/blog-manage.component';

import { AreaListComponent } from '../../pages/area-guides/area-list/area-list.component';
import { AreaOptionComponent } from '../../pages/area-guides/area-option/area-option.component';
import { AreaManageComponent } from '../../pages/area-guides/area-manage/area-manage.component';

import { GuideListComponent } from '../../pages/buy-and-sell/guide-list/guide-list.component';
import { GuideDetailsComponent } from '../../pages/buy-and-sell/guide-details/guide-details.component';

import {PartnerComponent} from '../../pages/partner/partner.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';

import { TransferListComponent } from '../../pages/leads/transfer-list/transfer-list.component';
import {CustomerCareLeadComponent} from '../../pages/customer-care/lead/customer-care-lead.component';
import {CustomerCareEditLeadComponent} from '../../pages/customer-care/edit-lead/customer-care-edit-lead.component';
import {LeadListComponent} from '../../pages/customer-care/lead-list/lead-list.component';

import { LeadSummeryComponent } from '../../pages/leads/lead-summery/lead-summery.component';
import { CloseLeadcomponent } from '../../pages/leads/close-lead/close-leadcomponent';

import { AssignLeadComponent } from '../../pages/lead-management/assign-lead/assign-lead.component';
import { AssignHistoryComponent } from '../../pages/lead-management/assign-history/assign-history.component';
import { ReAssignLeadComponent } from '../../pages/lead-management/re-assign-lead/re-assign-lead.component';
import { LeadReportComponent } from '../../pages/lead-management/lead-report/lead-report.component';
import { DailyActivityReportComponent } from '../../pages/lead-management/daily-activity-report/daily-activity-report.component';

import { ProjectSettingsComponent } from '../../pages/settings/project-settings/project-settings.component';
import {LoneCalculateInstructionComponent} from '../../pages/lone-calculate-instruction/lone-calculate-instruction.component';
import {InteriorListComponent} from '../../pages/interior/interior-list/interior-list.component';
import {InteriorDetailsComponent} from '../../pages/interior/interior-details/interior-details.component';

// notifications manage
import {NotificationsComponent} from '../../pages/notifications/notifications.component';

// role user manage

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    // administrator module
    { path: 'administrator/role-manage',           component: RoleComponent },
    { path: 'administrator/assign-role',           component: AssignUserRoleComponent },
    { path: 'administrator/user-manage',           component: UserManageComponent },
    { path: 'administrator/branch-manage',           component: BranchManageComponent },
    // system module
    { path: 'system-manage/system-role',           component: SystemRoleComponent },
    { path: 'system-manage/system-user',           component: SystemUserComponent },
    { path: 'system-manage/assign-user-role',      component: SystemUserRoleComponent},
    { path: 'system-manage/team-setup',            component: TeamSetupComponent },
    // data collector module
    { path: 'data-collector/dc-form',            component: DcFormComponent },
    { path: 'data-collector/qc-pending/edit/:id',            component: DcFormComponent },
    { path: 'data-collector/qc-property-list',            component: QcPropertyListComponent },
    { path: 'data-collector/approved-listing',            component: ApproveListingComponent },
    // Property Manage
    { path: 'property-management/for-sales',            component: ForSaleComponent },
    { path: 'property-management/edit/:id/:pid',            component: ForSaleComponent },
    { path: 'property-management/for-rent',            component: ForRentComponent },
    { path: 'property-management/rent/edit/:id/:pid',            component: ForRentComponent },
    { path: 'property-management/for-land-sale',            component: ForLandSaleComponent },
    { path: 'property-management/land-sale/edit/:id/:pid',            component: ForLandSaleComponent },
    // property Qc Sale manage
    { path: 'property-management/qc-property-list',            component: FSQcPropertyListComponent },
    // property Qc Rent manage
    { path: 'property-management/qc-rent-property-list',            component: FRQcPropertyListComponent },
    // property Qc land Sale manage
    { path: 'property-management/qc-land-sale-property-list',            component: FLSQcPropertyListComponent },
    // property Approve for sale listing
    { path: 'property-management/approved-listing',            component: FSApproveListingComponent },
    { path: 'property-management/approved-rent-listing',            component: FRApproveListingComponent },
    { path: 'property-management/approved-land-sale-listing',            component: FLSApproveListingComponent },
    // property Manage product 
    { path: 'property-management/product',            component: ProductComponent },
    { path: 'property-management/product/rent-product',            component: RentProductComponent },
    { path: 'property-management/product/land-sale-product',            component: LandSaleProductComponent },
    // Reassign property Manage product 
    { path: 'property-management/reassign-property',            component: FSReassignPropertyComponent },
    { path: 'property-management/reassign-property/rent-property',            component: FRReassignPropertyComponent },
    { path: 'property-management/reassign-property/land-sale-property',            component: FLSReassignPropertyComponent },

    // website listing
    { path: 'website-listing/add-to-website',            component: AddToWebsiteComponent },
    { path: 'website-listing/website-property/edit/:id/:pid',            component: AddToWebsiteComponent },
    { path: 'website-listing/website-land-sale',            component: WebsiteLandSaleComponent },
    { path: 'website-listing/website-land-sale-listing/edit/:id/:pid',             component: WebsiteLandSaleComponent },
    { path: 'website-listing/website-property-listing',            component: WebsiteSalePropertyListComponent },
    { path: 'website-listing/website-rent-listing',            component: WebsiteRentPropertyListComponent },
    { path: 'website-listing/website-land-sale-listing',            component: WebsiteLandSaleListComponent },
    // Lead Manage
    { path: 'leads/add-new-lead',                    component: NewLeadComponent },
    { path: 'leads/edit-lead/:id',                    component: EditLeadComponent },
    { path: 'leads/manage-leads',                    component: ManageLeadComponent },
    { path: 'leads/to-do-list',                    component: TodolistComponent },
    { path: 'leads/go-to-do-list/:step',                    component: TodolistComponent },
    { path: 'leads/calender',                    component: CalenderComponent },
    { path: 'leads/search-leads',                    component: SearchLeadComponent },
    { path: 'leads/summary',                    component: LeadSummeryComponent },
    { path: 'leads/close-leads',                    component: CloseLeadcomponent },
    { path: 'leads/token-payment',                    component: TokenPaymentComponent },
    { path: 'leads/shared-leads',                    component: ShareLeadComponent },
    { path: 'leads/notification',                    component: NotificationComponent },


    // System Settings
    { path: 'system-settings/additional-setting',            component: SystemSettingsComponent },

    { path: 'ap/banner-manage',         component: BannerSectionComponent },
    { path: 'ap/how-it-works',           component: HowItWorkComponent },
    { path: 'ap/customer-experiences',   component: CustomerExperiencesComponent },
    { path: 'ap/faq',                    component: FaqComponent },

    { path: 'blog/banner-manage',                    component: BlogBannerComponent },
    { path: 'blog/blog-category',                    component: BlogCategoryComponent },
    { path: 'blog/blog-manage',                    component: BlogManageComponent },

    { path: 'area-guide/area-list',                    component: AreaListComponent },
    { path: 'area-guide/area-option',                    component: AreaOptionComponent },
    { path: 'area-guide/area-details',                    component: AreaManageComponent },

    { path: 'buy-sell-guide/guide-list',                    component: GuideListComponent },
    { path: 'buy-sell-guide/guide-details/:slug',           component: GuideDetailsComponent },

    { path: 'leads/transfer-list',                    component: TransferListComponent },
    { path: 'customer-care/lead',                    component: CustomerCareLeadComponent },
    { path: 'customer-care/edit-lead/:id',                    component: CustomerCareEditLeadComponent },
    { path: 'customer-care/lead-list',                    component: LeadListComponent },

    { path: 'partners/partners-list',                    component: PartnerComponent },
    { path: 'lone/instruction',                    component: LoneCalculateInstructionComponent },
    { path: 'interior/interior-list',                    component: InteriorListComponent },
    { path: 'interior/interior-details/:slug',                    component: InteriorDetailsComponent },

    { path: 'lead-manage/lead-assign',                    component: AssignLeadComponent },
    { path: 'lead-manage/assign-history',                    component: AssignHistoryComponent },
    { path: 'lead-manage/lead-re-assign',                    component: ReAssignLeadComponent },
    { path: 'lead-manage/lead-report',                    component: LeadReportComponent },
    { path: 'lead-manage/daily-activity-report',                    component: DailyActivityReportComponent },


    { path: 'settings/project-settings',                    component: ProjectSettingsComponent },


    { path: 'user-profile',   component: UserProfileComponent },

    { path: 'notifications',   component: NotificationsComponent },


];
