import React, { useState, useEffect } from "react";
import Select from "react-select";

const fetchJobsData = async () => {
  const response = await fetch("/src/api/jobs.json");
  const data = await response.json();
  return data;
};

export default function JobBoard() {
  const [locations, setLocations] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); // New state for selected job

  useEffect(() => {
    const getJobsData = async () => {
      const data = await fetchJobsData();
      setJobs(data);
      setFilteredJobs(data);

      const uniqueLocations = Array.from(
        new Set(data.map((job) => job.location))
      ).map((location) => ({
        value: location,
        label: location,
      }));
      uniqueLocations.push({
        value: "current-location",
        label: "Use Your Current Location",
      });

      setLocations(uniqueLocations);
    };

    getJobsData();
  }, []);

  useEffect(() => {
    if (searchTriggered) {
      const filterJobs = () => {
        let results = jobs;

        if (searchQuery) {
          results = results.filter((job) =>
            job.position.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (selectedLocation && selectedLocation.value !== "current-location") {
          results = results.filter(
            (job) => job.location === selectedLocation.value
          );
        }

        setFilteredJobs(results);
      };

      filterJobs();
    }
  }, [searchTriggered, searchQuery, selectedLocation, jobs]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLocationChange = (selectedOption) => {
    if (selectedOption.value === "current-location") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          findNearestLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      setSelectedLocation(selectedOption);
    }
  };

  const handleSearchClick = () => {
    setSearchTriggered(true);
  };

  const findNearestLocation = (latitude, longitude) => {
    const nearestLocation = locations.find((location) => {
      return true; // Implement your logic for finding the nearest location
    });
    setSelectedLocation(nearestLocation);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job); // Set the selected job when a card is clicked
  };

  return (
    <div className="max-w-7xl mx-auto justify-center min-h-screen items-center flex flex-row">
      <div className="flex w-2/3 flex-col">
        {/* Finder Section */}
        <div className="m-2 flex justify-between rounded-lg items-center space-x-2 bg-[#F0F0F4] p-4">
          <div className="flex w-full items-center rounded-lg p-2">
            <input
              type="text"
              placeholder="Search jobs..."
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-0 focus:border-gray-300"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="flex-shrink-0 w-1/3">
              <Select
                options={locations}
                placeholder="Select Location"
                isSearchable
                onChange={handleLocationChange}
                value={selectedLocation}
                className="focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <button
            className="bg-[#FA5E9F] rounded-lg font-bold text-white px-4 py-2"
            onClick={handleSearchClick}
          >
            Search
          </button>
        </div>

        {/* Search Results Section */}
        <div className="m-2 rounded-xl p-4 bg-[#F0F0F4] h-[656px] overflow-auto scrollbar-hidden">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold py-2">Search Results</h2>
            <span>{filteredJobs.length} Jobs Found</span>
          </div>
          {/* Cards Section */}
          <div className="grid grid-cols-2 gap-4 m-2">
            {filteredJobs.map((job, index) => (
              <div
                key={index}
                className="px-4 rounded-lg bg-white hover:shadow-lg hover:border cursor-pointer"
                onClick={() => handleJobClick(job)} // Handle click on card
              >
                <div className="flex justify-start gap-x-2 py-1 pt-4">
                  <div className="items-center flex">
                    <img
                      className="h-12 w-12 aspect-square border bg-[#DDE0DD] rounded-md p-2"
                      src={job.logo}
                      alt={job.company}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold pb-1">{job.position}</h3>
                    <p>{job.company}</p>
                  </div>
                </div>

                <div className="my-4 flex flex-wrap gap-2 py-1">
                  {job.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-[#DDE0DD]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="my-4 flex justify-between items-center py-1">
                  <div className="text-sm flex justify-between gap-3 font-medium text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="#FA5E9F"
                      className="bi bi-wallet2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                    </svg>
                    {job.salary}
                  </div>
                  <div className="text-sm text-gray-500">{job.postedTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="w-1/3 h-[764px] rounded-lg bg-white p-4">
        {/* Conditional Rendering */}
        {!selectedJob ? (
          // Display image if no job is selected
          <div className="flex justify-center items-center h-full">
            <img
              src="/undraw_interview_re_e5jn.svg"
              alt="Sidebar Image"
              className="max-w-full max-h-full rounded-lg"
            />
          </div>
        ) : (
          // Display job details if a job is selected
          <div>
            <h2 className="text-xl font-bold">{selectedJob.position}</h2>
            <p className="text-lg">{selectedJob.company}</p>
            <p className="text-sm text-gray-500">{selectedJob.location}</p>
            <p className="mt-2">{selectedJob.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
