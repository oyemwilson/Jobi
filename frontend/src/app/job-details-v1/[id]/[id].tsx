import axios from 'axios';
import { GetServerSideProps } from 'next';
import JobDetailsDynamicPage from './page';

interface JobDetails {
  // Define the shape of your job details object
  id: string;
  title: string;
  // Add other properties as needed
}

export const getServerSideProps: GetServerSideProps<{ job: JobDetails | null }> = async ({ params }) => {
  const { id } = params || {};
  let job: JobDetails | null = null;

  try {
    if (id) {
      const response = await axios.get(`http://localhost:5001/api/joblistings/${id}`);
      job = response.data;
    }
  } catch (error) {
    console.error('Error fetching job details:', error);
  }

  return {
    props: {
      job,
    },
  };
};

export default function JobDetails({ job }: { job: JobDetails | null }) {
  return <JobDetailsDynamicPage job={job} />;
}