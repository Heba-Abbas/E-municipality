import React from "react";

import ServiceRequestsPage from "./ServiceRequestsPage";

import {
  getTechnicalRequests,
  getTechnicalRequestById,
  startTechnicalReview,
  forwardTechnicalRequestToEngineering,
  rejectTechnicalRequest,
  getTechnicalAttachment,
} from "../services/serviceRequestsApi";

function TechnicalOfficeRequestsPage() {
  return (
    <ServiceRequestsPage
      title="طلبات الخدمات - المكتب الفني"
      description="مراجعة طلبات الخدمات وإرسالها إلى الجهة الهندسية"
      role="technical"
      listRequests={getTechnicalRequests}
      getRequestById={getTechnicalRequestById}
      openAttachment={getTechnicalAttachment}
      startReview={startTechnicalReview}
      forwardRequest={
        forwardTechnicalRequestToEngineering
      }
      rejectRequest={rejectTechnicalRequest}
    />
  );
}

export default TechnicalOfficeRequestsPage;