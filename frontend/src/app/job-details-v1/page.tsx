'use client';

import React from 'react';
import Wrapper from '@/layouts/wrapper';
import Header from '@/layouts/headers/header';
import JobDetailsV1Area from '@/app/components/job-details/job-details-v1-area';
import JobPortalIntro from '@/app/components/job-portal-intro/job-portal-intro';
import JobDetailsBreadcrumb from '@/app/components/jobs/breadcrumb/job-details-breadcrumb';
import RelatedJobs from '@/app/components/jobs/related-jobs';
import FooterOne from '@/layouts/footers/footer-one';

const JobDetailsDynamicPage = ({ job }) => {
  return (
    <Wrapper>
      <div className="main-page-wrapper">
        {/* Header */}
        <Header />

        {/* Breadcrumb */}
        <JobDetailsBreadcrumb />

        {/* Job Details */}
        {job && <JobDetailsV1Area job={job} />}

        {/* Related Jobs */}
        {job && <RelatedJobs category={job.category} />}

        {/* Job Portal Intro */}
        <JobPortalIntro />

        {/* Footer */}
        <FooterOne />
      </div>
    </Wrapper>
  );
};

export default JobDetailsDynamicPage;