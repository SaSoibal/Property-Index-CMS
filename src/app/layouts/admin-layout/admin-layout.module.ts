import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {SafePipe} from '../../pipe/SafePipe.pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../modules/material.module';
import {NgZorroAntdModule} from '../../modules/ng-zorro-ant.module';
import {ClipboardModule} from 'ngx-clipboard';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {DashboardComponent, LeadDetail} from '../../pages/dashboard/dashboard.component';
// administrator module
import {RoleComponent, CreateRole, DeleteRole} from '../../pages/administrator/roles/role.component';
import {
  AssignUserRoleComponent,
  AssignUserRoles,
  DeleteAssignUser
} from '../../pages/administrator/assign-user-role/assign-user-role.component';
import {UserManageComponent, CreateUser, DeleteUser} from '../../pages/administrator/user-manages/user-manage.component';
import {BranchManageComponent, CreateBranch, DeleteBranch} from '../../pages/administrator/branch-manage/branch-manage.component';
import {PropertyAreaComponent, CreatePropertyArea, DeletePropertyArea} from '../../pages/system-settings/area/property-area.component';
import {CityComponent, CreateCity, DeleteCity} from '../../pages/system-settings/city/city.component';
import {DepartmentComponent, CreateDepartment, DeleteDepartment} from '../../pages/system-settings/department/department.component';
// system module
import {SystemRoleComponent, CreateSystemRole, DeleteSystemRole} from '../../pages/system-manage/system-roles/system-role.component';
import {SystemUserComponent, CreateSysUser, DeleteSysUser} from '../../pages/system-manage/system-user/system-user.component';
import {SystemUserRoleComponent, SysUserRoles, DeleteUserRole} from '../../pages/system-manage/system-user-role/system-user-role.component';
import {TeamSetupComponent, CreateTeamSetup, ViewTeam, DeleteTeamSetup} from '../../pages/system-manage/team-setup/team-setup.component';
// data collector module
import {DcFormComponent} from '../../pages/data-collector/dc-form/dc-form.component';
import {QcPropertyListComponent} from '../../pages/data-collector/qc-property-lists/qc-property-list.component';
import {
  QcPropertyPendingListComponent,
  QcPendingModel,
  QcPendingDeleteModel
} from '../../pages/data-collector/qc-property-lists/qc-property-pending-lists/qc-property-pending-list.component';
import {
  QcPropertyRejectedListComponent, QcRejectedModel, QcRejectedDeleteModel
} from '../../pages/data-collector/qc-property-lists/qc-property-rejected-lists/qc-property-rejected-list.component';
import {
  ApproveListingComponent,
  QcApproveModel,
  ApproveAllocateModel
} from '../../pages/data-collector/approve-listing/approve-listing.component';
// Property Manage
import {ForSaleComponent, SaleMapModel} from '../../pages/property-manage/for-sale/for-sale.component';
import {ForRentComponent, RentMapModel} from '../../pages/property-manage/for-rent/for-rent.component';
import {ForLandSaleComponent, LandSaleMapModel} from '../../pages/property-manage/for-land-sale/for-land-sale.component';
// Property QC Manage
import {FSQcPropertyListComponent} from '../../pages/property-manage/for-sale-qc-property-list/for-sale-qc-property-list.component';
import {
  FSQcSalePendingListComponent,
  QcSalePendingModel,
  QcSalePendingDeleteModel
} from '../../pages/property-manage/for-sale-qc-property-list/qc-sale-property-pending-lists/qc-sale-property-pending-list.component';
import {
  FSQcSaleRejectedListComponent,
  QcSaleRejectedModel,
  QcSaleRejectedDeleteModel
} from '../../pages/property-manage/for-sale-qc-property-list/qc-sale-property-rejected-lists/qc-sale-property-rejected-list.component';
import {
  FSQcSaleDeletedListComponent,
  QcSaleDeleteddModel
} from '../../pages/property-manage/for-sale-qc-property-list/qc-sale-property-deleted-lists/qc-sale-property-deleted-list.component';

import {FRQcPropertyListComponent} from '../../pages/property-manage/for-rent-qc-property-list/for-rent-qc-property-list.component';
import {
  FSQcRentPendingListComponent,
  QcRentPendingModel,
  QcRentPendingDeleteModel
} from '../../pages/property-manage/for-rent-qc-property-list/qc-rent-property-pending-lists/qc-rent-property-pending-list.component';
import {
  FSQcRentRejectedListComponent,
  QcRentRejectedModel,
  QcRentRejectedDeleteModel
} from '../../pages/property-manage/for-rent-qc-property-list/qc-rent-property-rejected-lists/qc-rent-property-rejected-list.component';
import {
  FSQcRentDeletedListComponent,
  QcRentDetailsModel
} from '../../pages/property-manage/for-rent-qc-property-list/qc-rent-property-deleted-lists/qc-rent-property-deleted-list.component';

import {
  FLSQcPropertyListComponent
} from '../../pages/property-manage/for-land-sale-qc-property-list/for-land-sale-qc-property-list.component';
import {
  FLSQcLandSalePendingListComponent,
  QcLandSalePendingDeleteModel,
  QcLandSalePendingModel
} from '../../pages/property-manage/for-land-sale-qc-property-list/qc-land-sale-property-pending-lists/qc-land-sale-property-pending-list.component';
import {
  FLSQcLandSaleRejectedListComponent,
  QcLandSaleRejectedDeleteModel,
  QcLandSaleRejectedModel
} from '../../pages/property-manage/for-land-sale-qc-property-list/qc-land-sale-property-rejected-lists/qc-land-sale-property-rejected-list.component';
import {
  FLSQcLandSaleDeletedListComponent,
  QcLandSaleDetailsModel
} from '../../pages/property-manage/for-land-sale-qc-property-list/qc-land-sale-property-deleted-lists/qc-land-sale-property-deleted-list.component';

import {
  FSApproveListingComponent,
  ApprovedDetailsModel,
  SaleListingModel
} from '../../pages/property-manage/approve-listing/for-sales/for-sales-approve-listing.component';
import {
  FRApproveListingComponent,
  ApprovedRentDetailsModel,
  RentListingModel
} from '../../pages/property-manage/approve-listing/for-rent/for-rent-approve-listing.component';
import {
  FLSApproveListingComponent,
  ApprovedLandSaleDetailsModel,
  LandSaleListingModel
} from '../../pages/property-manage/approve-listing/for-land-sales/for-land-sale-approve-listing.component';
import {ProductComponent, ProductDetailsModel, ProductStepModel} from '../../pages/property-manage/product/product.component';
import {
  RentProductComponent,
  RentProductDetailsModel,
  RentProductStepModel
} from '../../pages/property-manage/product/rent-product/rent-product.component';
import {
  LandSaleProductComponent,
  LandSaleProductDetailsModel,
  LandSaleProductStepModel
} from '../../pages/property-manage/product/land-sale-product/land-sale-product.component';
import {
  FSReassignPropertyComponent,
  ReassignDetailsModel,
  SaleReassignModel
} from '../../pages/property-manage/reassign-property/for-sales/for-sales-reassign-property.component';
import {
  FRReassignPropertyComponent,
  RentReassignDetailsModel,
  RentReassignModel
} from '../../pages/property-manage/reassign-property/for-rent/for-rent-reassign-property.component';
import {
  FLSReassignPropertyComponent,
  LandSaleReassignDetailsModel,
  LandSaleReassignModel
} from '../../pages/property-manage/reassign-property/for-land-sales/for-land-sale-reassign-property.component';

// website listing
import {AddToWebsiteComponent, WebsiteMapModel} from '../../pages/website-listing/add-to-website/add-to-website.component';
import {WebsiteLandSaleComponent, WLandSaleMapModel} from '../../pages/website-listing/website-land-sale/website-land-sale.component';
import {
  WebsiteSalePropertyListComponent,
  WBSsaleDetailsModel
} from '../../pages/website-listing/website-sale-list/website-sale-property-list.component';
import {
  WebsiteRentPropertyListComponent,
  WBSrentDetailsModel
} from '../../pages/website-listing/website-rent-list/website-rent-property-list.component';
import {
  WebsiteLandSaleListComponent,
  WebsiteLandSaleModel
} from '../../pages/website-listing/website-land-sale-list/website-land-sale-property-list.component';
// Lead Manage
import {NewLeadComponent} from '../../pages/leads/new-lead/new-lead.component';
import {EditLeadComponent} from '../../pages/leads/edit-lead/edit-lead.component';
import {ManageLeadComponent} from '../../pages/leads/manage-lead/manage-lead.component';
import {TodolistComponent, StepTodolist, browsePropertyModel, RescheduleReassign} from '../../pages/leads/todolist/todolist.component';
import {AllLeadsComponent} from '../../pages/leads/manage-lead/all-leads/all-leads.component';
import {AllNewLeadsComponent} from '../../pages/leads/manage-lead/new-leads/new-leads.component';
import {FirstCallComponent} from '../../pages/leads/manage-lead/first-call/first-call.component';
import {KycComponent} from '../../pages/leads/manage-lead/kyc/kyc.component';
import {FollowupcallComponent} from '../../pages/leads/manage-lead/followupcall/followupcall.component';
import {ViewingComponent} from '../../pages/leads/manage-lead/viewing/viewing.component';
import {ReViewingComponent} from '../../pages/leads/manage-lead/re-viewing/re-viewing.component';
import {NegotiationComponent} from '../../pages/leads/manage-lead/negotiation/negotiation.component';
import {TokenReceiveComponent} from '../../pages/leads/manage-lead/token-receive/token-receive.component';
import {SellPermissionComponent} from '../../pages/leads/manage-lead/sell-permission/sell-permission.component';
import {DealCloseComponent} from '../../pages/leads/manage-lead/deal-close/deal-close.component';
// Calender Manage
import {CalenderComponent, EventDetailsModel} from '../../pages/leads/calender/calender.component';
import {
  SearchLeadComponent,
  SearchStepTodolist,
  SearchPropertyModel,
  SearchRescheduleReassign
} from '../../pages/leads/search-lead/search-lead.component';
import {LeadSummeryComponent} from '../../pages/leads/lead-summery/lead-summery.component';
import {CloseLeadcomponent} from '../../pages/leads/close-lead/close-leadcomponent';
import {TokenPaymentComponent, TokenDetailsModel} from '../../pages/leads/token-payment/token-payment.component';
import {ShareLeadComponent} from '../../pages/leads/share-lead/share-lead.component';
import {NotificationComponent, NotificationModel} from '../../pages/leads/notification/notification.component';

// System setting
import {SystemSettingsComponent} from '../../pages/system-settings/system-settings.component';
import {
  ClassificationComponent,
  CreateClassification,
  DeleteClassification
} from '../../pages/system-settings/classification/classification.component';
import {
  TaskSubTypeComponent,
  CreateTaskSubType,
  DeleteTaskSubType
} from '../../pages/system-settings/task-sub-type/task-sub-type.component';
import {ClassifyComponent, CreateClassify, DeleteClassify} from '../../pages/system-settings/task-classify/task-classify.component';
import {ClientTypeComponent, ClientType, DeleteType} from '../../pages/system-settings/client-type/client-type.component';
import {OccupationComponent, CreateOccupation, DeleteOccupation} from '../../pages/system-settings/occupation/occupation.component';
import {
  ClientRatingComponent,
  CreateClientRating,
  DeleteClientRating
} from '../../pages/system-settings/client-rating/client-rating.component';
import {BuyingIntentComponent, CreateProductType, DeleteProductType} from '../../pages/system-settings/product-type/product-type.component';
import {LocationComponent, Location, DeleteLocation} from '../../pages/system-settings/location/location.component';
import {
  SelectSourceComponent,
  CreateSelectSource,
  DeleteSelectSource
} from '../../pages/system-settings/select-source/select-source.component';
import {LeadStatusComponent, CreateLeadStatus, DeleteLeadStatus} from '../../pages/system-settings/lead-status/lead-status.component';
import {
  PreferredTenantsComponent,
  AddTenants,
  DeleteTenants
} from '../../pages/system-settings/preferred-tenants/preferred-tenants.component';
import {ProjectComponent, CreateProject, DeleteProject} from '../../pages/system-settings/project/project.component';
import {
  ConstructionStatusComponent,
  CreateConstructionStatus,
  DeleteConstructionStatus
} from '../../pages/system-settings/construction-status/construction-status.component';
// tslint:disable-next-line:max-line-length
import {ProjectTypeComponent, CreateProjectType, DeleteProjectType} from '../../pages/system-settings/project-type/project-type.component';


// Add Property
import {
  BannerSectionComponent,
  CreateBanner,
  ReadBanner,
  DeleteBanner
} from '../../pages/add-property/banner-section/banner-section.component';
import {HowItWorkComponent, CreateHIW, ReadHIW, DeleteHIW} from '../../pages/add-property/how-it-work/how-it-work.component';
import {
  CustomerExperiencesComponent,
  CreateCustomerExp,
  ReadCustomerExp,
  DeleteCustomerExp
} from '../../pages/add-property/customer-experiences/customer-experiences.component';
import {FaqComponent, CreateFaq, ReadFaq, DeleteFaq} from '../../pages/add-property/faq/faq.component';
// Blog
import {
  BlogBannerComponent,
  CreateBlogBanner,
  ReadBlogBanner,
  DeleteBlogBanner
} from '../../pages/blog/banner-manage/banner-manage.component';
import {
  BlogCategoryComponent,
  CreateBlogCategory,
  ReadBlogCategory,
  DeleteBlogCategory
} from '../../pages/blog/blog-category/category-manage.component';
import {BlogManageComponent, CreateBlog, ReadBlog, DeleteBlog} from '../../pages/blog/blog-manage/blog-manage.component';
// Area Guide
import {AreaListComponent, CreateAreaList, ReadAreaList, DeleteAreaList} from '../../pages/area-guides/area-list/area-list.component';
import {
  AreaOptionComponent,
  CreateAreaOption,
  ReadAreaOption,
  DeleteAreaOption
} from '../../pages/area-guides/area-option/area-option.component';
import {AreaManageComponent, CreateArea, ReadArea, DeleteArea} from '../../pages/area-guides/area-manage/area-manage.component';
// Area Guide list
import {GuideListComponent, CreateGuide, ReadGuide, DeleteGuide} from '../../pages/buy-and-sell/guide-list/guide-list.component';
import {
  GuideDetailsComponent,
  CreateGuideDetails,
  ReadGuideDetails,
  DeleteGuideDetails
} from '../../pages/buy-and-sell/guide-details/guide-details.component';
// todo list
import {
  TransferListComponent,
  TransferApproveModel,
  TransferLeadsDetails,
  TransferUserDetails
} from '../../pages/leads/transfer-list/transfer-list.component';
// Customer Care
import {CustomerCareLeadComponent} from '../../pages/customer-care/lead/customer-care-lead.component';
import {CustomerCareEditLeadComponent} from '../../pages/customer-care/edit-lead/customer-care-edit-lead.component';
import {LeadListComponent} from '../../pages/customer-care/lead-list/lead-list.component';


import {AssignLeadComponent, AssignModel} from '../../pages/lead-management/assign-lead/assign-lead.component';
import {AssignHistoryComponent, AssignLeadDetModel} from '../../pages/lead-management/assign-history/assign-history.component';
import {ReAssignLeadComponent, ReAssignModel} from '../../pages/lead-management/re-assign-lead/re-assign-lead.component';
import {LeadReportComponent, StepWiseLeadModel} from '../../pages/lead-management/lead-report/lead-report.component';
import {
  DailyActivityReportComponent,
  StepActivityWiseLeadModel
} from '../../pages/lead-management/daily-activity-report/daily-activity-report.component';

// Settings > project settings
import {ProjectSettingsComponent} from '../../pages/settings/project-settings/project-settings.component';
import {
  ProjectSubTypeComponent,
  CreateProjectSubType,
  DeleteProjectSubType
} from '../../pages/settings/project-settings/project-sub-type/project-sub-type.component';

import {UserProfileComponent} from '../../pages/user-profile/user-profile.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RegistrationComponent} from '../../pages/leads/manage-lead/registration/registration.component';
import {PartnerComponent, DeletePartner, CreatePartner} from '../../pages/partner/partner.component';
import {LoneCalculateInstructionComponent} from '../../pages/lone-calculate-instruction/lone-calculate-instruction.component';
import {
  InteriorListComponent,
  CreateInterior,
  DeleteInterior,
  ReadInterior
} from '../../pages/interior/interior-list/interior-list.component';
import {InteriorDetailsComponent} from '../../pages/interior/interior-details/interior-details.component';
import {
  InteriorInformationComponent,
  CreateInteriorInfo,
  DeleteInteriorInfo,
  ReadInteriorInfo
} from '../../pages/interior/interior-details/intorior-information/interior-information.component';
import {
  WhatWeProvideComponent,
  CreateWhatWeProvide,
  DeleteWhatWeProvide,
  ReadWhatWeProvide
} from '../../pages/interior/interior-details/what-we-provide/what-we-provide.component';
import {
  InteriorGalleryComponent,
  CreateGallery,
  DeleteGallery
} from '../../pages/interior/interior-details/gallery/interior-gallery.component';
import {
  InteriorFaqComponent,
  CreateInteriorFaq,
  DeleteInteriorFaq,
  ReadInteriorFaq
} from '../../pages/interior/interior-details/interior-faq/interior-faq.component';
import {JustACallAwayComponent} from '../../pages/interior/interior-details/just-a-call-away/just-a-call-away.component';
// notifications manage
import {NotificationsComponent, notificationModel} from '../../pages/notifications/notifications.component';
// import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import {CanvasJSChart} from './../../../assets/canvasjs.angular.component';
import {AboutUsComponent} from '../../pages/about-us/about-us.component';
import {AboutUsWhyUsComponent, CreateWhyUs, DeleteWhyUs, ReadWhyUs} from '../../pages/about-us/about-us-why-us/about-us-why-us.component';
import {
  AboutUsGalleryComponent,
  CreateAboutUsGallery, DeleteAboutUsGallery,
  ReadAboutUsGallery
} from '../../pages/about-us/about-us-gallery/about-us-gallery.component';
import {
  AboutUsGalleryAlbumComponent,
  CreateGalleryAlbum, DeleteGalleryAlbum, ReadGalleryAlbum
} from '../../pages/about-us/about-us-gallery-album/about-us-gallery-album.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    NgxDropzoneModule,
    // CanvasJSAngularChartsModule,
  ],
  declarations: [
    SafePipe,
    DashboardComponent, LeadDetail,
    RoleComponent, CreateRole, DeleteRole,
    AssignUserRoleComponent, AssignUserRoles, DeleteAssignUser,
    UserManageComponent, CreateUser, DeleteUser,
    BranchManageComponent, CreateBranch, DeleteBranch,

    PropertyAreaComponent, CreatePropertyArea, DeletePropertyArea,
    CityComponent, CreateCity, DeleteCity,
    DepartmentComponent, CreateDepartment, DeleteDepartment,

    SystemRoleComponent, CreateSystemRole, DeleteSystemRole,
    SystemUserComponent, CreateSysUser, DeleteSysUser,
    SystemUserRoleComponent, SysUserRoles, DeleteUserRole,
    TeamSetupComponent, CreateTeamSetup, ViewTeam, DeleteTeamSetup,

    DcFormComponent,
    QcPropertyListComponent,
    QcPropertyPendingListComponent, QcPendingModel, QcPendingDeleteModel,
    QcPropertyRejectedListComponent, QcRejectedModel, QcRejectedDeleteModel,
    ApproveListingComponent, QcApproveModel, ApproveAllocateModel,

    ForSaleComponent, SaleMapModel,
    ForRentComponent, RentMapModel,
    ForLandSaleComponent, LandSaleMapModel,

    FSQcPropertyListComponent,
    FSQcSalePendingListComponent, QcSalePendingModel, QcSalePendingDeleteModel,
    FSQcSaleRejectedListComponent, QcSaleRejectedModel, QcSaleRejectedDeleteModel,
    FSQcSaleDeletedListComponent, QcSaleDeleteddModel,

    FRQcPropertyListComponent,
    FSQcRentPendingListComponent, QcRentPendingModel, QcRentPendingDeleteModel,
    FSQcRentRejectedListComponent, QcRentRejectedModel, QcRentRejectedDeleteModel,
    FSQcRentDeletedListComponent, QcRentDetailsModel,

    FLSQcPropertyListComponent,
    FLSQcLandSalePendingListComponent, QcLandSalePendingModel, QcLandSalePendingDeleteModel,
    FLSQcLandSaleRejectedListComponent, QcLandSaleRejectedModel, QcLandSaleRejectedDeleteModel,
    FLSQcLandSaleDeletedListComponent, QcLandSaleDetailsModel,

    FSApproveListingComponent, ApprovedDetailsModel, SaleListingModel,
    FRApproveListingComponent, ApprovedRentDetailsModel, RentListingModel,
    FLSApproveListingComponent, ApprovedLandSaleDetailsModel, LandSaleListingModel,
    ProductComponent, ProductDetailsModel, ProductStepModel,
    RentProductComponent, RentProductDetailsModel, RentProductStepModel,
    LandSaleProductComponent, LandSaleProductDetailsModel, LandSaleProductStepModel,
    FSReassignPropertyComponent, ReassignDetailsModel, SaleReassignModel,
    FRReassignPropertyComponent, RentReassignDetailsModel, RentReassignModel,
    FLSReassignPropertyComponent, LandSaleReassignDetailsModel, LandSaleReassignModel,

    AddToWebsiteComponent, WebsiteMapModel,
    WebsiteLandSaleComponent, WLandSaleMapModel,
    WebsiteSalePropertyListComponent, WBSsaleDetailsModel,
    WebsiteRentPropertyListComponent, WBSrentDetailsModel,
    WebsiteLandSaleListComponent, WebsiteLandSaleModel,

    NewLeadComponent,
    EditLeadComponent,
    ManageLeadComponent,
    TodolistComponent, StepTodolist, browsePropertyModel, RescheduleReassign,
    AllLeadsComponent,
    AllNewLeadsComponent,
    FirstCallComponent,
    KycComponent,
    FollowupcallComponent,
    ViewingComponent,
    ReViewingComponent,
    NegotiationComponent,
    TokenReceiveComponent,
    SellPermissionComponent,
    RegistrationComponent,
    DealCloseComponent,

    CalenderComponent, EventDetailsModel,
    SearchLeadComponent, SearchStepTodolist, SearchPropertyModel, SearchRescheduleReassign,

    LeadSummeryComponent,
    CloseLeadcomponent,
    TokenPaymentComponent, TokenDetailsModel,
    ShareLeadComponent,
    NotificationComponent, NotificationModel,

    SystemSettingsComponent,

    ClientTypeComponent, ClientType, DeleteType,
    OccupationComponent, CreateOccupation, DeleteOccupation,
    ClientRatingComponent, CreateClientRating, DeleteClientRating,
    BuyingIntentComponent, CreateProductType, DeleteProductType,
    LocationComponent, Location, DeleteLocation,
    SelectSourceComponent, CreateSelectSource, DeleteSelectSource,
    LeadStatusComponent, CreateLeadStatus, DeleteLeadStatus,
    ClassificationComponent, CreateClassification, DeleteClassification,
    TaskSubTypeComponent, CreateTaskSubType, DeleteTaskSubType,
    ClassifyComponent, CreateClassify, DeleteClassify,
    PreferredTenantsComponent, AddTenants, DeleteTenants,
    ProjectComponent, CreateProject, DeleteProject,
    ProjectTypeComponent, CreateProjectType, DeleteProjectType,
    ConstructionStatusComponent, CreateConstructionStatus, DeleteConstructionStatus,

    BannerSectionComponent, CreateBanner, ReadBanner, DeleteBanner,
    HowItWorkComponent, CreateHIW, ReadHIW, DeleteHIW,
    CustomerExperiencesComponent, CreateCustomerExp, ReadCustomerExp, DeleteCustomerExp,
    FaqComponent, CreateFaq, ReadFaq, DeleteFaq,

    BlogBannerComponent, CreateBlogBanner, ReadBlogBanner, DeleteBlogBanner,
    BlogCategoryComponent, CreateBlogCategory, ReadBlogCategory, DeleteBlogCategory,
    BlogManageComponent, CreateBlog, ReadBlog, DeleteBlog,

    AreaListComponent, CreateAreaList, ReadAreaList, DeleteAreaList,
    AreaOptionComponent, CreateAreaOption, ReadAreaOption, DeleteAreaOption,
    AreaManageComponent, CreateArea, ReadArea, DeleteArea,

    GuideListComponent, CreateGuide, ReadGuide, DeleteGuide,
    GuideDetailsComponent, CreateGuideDetails, ReadGuideDetails, DeleteGuideDetails,

    PartnerComponent, DeletePartner, CreatePartner,
    LoneCalculateInstructionComponent,
    InteriorListComponent, CreateInterior, ReadInterior, DeleteInterior,
    InteriorDetailsComponent,
    InteriorInformationComponent, CreateInteriorInfo, ReadInteriorInfo, DeleteInteriorInfo,
    WhatWeProvideComponent, CreateWhatWeProvide, ReadWhatWeProvide, DeleteWhatWeProvide,
    InteriorGalleryComponent, CreateGallery, DeleteGallery,
    InteriorFaqComponent, CreateInteriorFaq, ReadInteriorFaq, DeleteInteriorFaq,
    JustACallAwayComponent,

    TransferListComponent, TransferApproveModel, TransferLeadsDetails, TransferUserDetails,

    CustomerCareLeadComponent,
    CustomerCareEditLeadComponent,
    LeadListComponent,

    AssignLeadComponent, AssignModel,
    AssignHistoryComponent, AssignLeadDetModel,
    ReAssignLeadComponent, ReAssignModel,
    LeadReportComponent, StepWiseLeadModel,
    DailyActivityReportComponent, StepActivityWiseLeadModel,


    ProjectSettingsComponent,
    ProjectSubTypeComponent, CreateProjectSubType, DeleteProjectSubType,


    UserProfileComponent,
    RoleComponent,
    NotificationsComponent, notificationModel,
    CanvasJSChart,

    AboutUsComponent, AboutUsWhyUsComponent, CreateWhyUs, ReadWhyUs, DeleteWhyUs,
    AboutUsGalleryComponent, CreateAboutUsGallery, ReadAboutUsGallery, DeleteAboutUsGallery,
    AboutUsGalleryAlbumComponent, CreateGalleryAlbum, ReadGalleryAlbum, DeleteGalleryAlbum,
  ],
  entryComponents: [
    CreateRole
  ],
})

export class AdminLayoutModule {
}
