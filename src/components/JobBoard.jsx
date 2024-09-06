import React, { useState, useEffect } from "react";
import Select from "react-select";

const fetchJobsData = async () => {
  const response = await fetch("/jobs.json");
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
  const [selectedJob, setSelectedJob] = useState(null);

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
      return true;
    });
    setSelectedLocation(nearestLocation);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div className="max-w-7xl mx-auto justify-center min-h-screen items-center flex flex-row">
      <div className="flex w-2/3 flex-col">
        <div className="m-2 flex justify-between rounded-lg items-center  bg-[#F0F0F4] p-4">
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

        <div className="m-2 rounded-xl p-4 bg-[#F0F0F4] h-[669px] overflow-auto scrollbar-hidden">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold py-2">Search Results</h2>
            <span>{filteredJobs.length} Jobs Found</span>
          </div>
          <div className="grid grid-cols-2 gap-4 m-2">
            {filteredJobs.map((job, index) => (
              <div
                key={index}
                className="px-4 rounded-lg bg-white hover:shadow-lg hover:border cursor-pointer "
                onClick={() => handleJobClick(job)}
              >
                <div className="flex justify-start gap-x-2 py-1 pt-4">
                  <div className="items-center flex">
                    <img
                      className="h-14 w-14 aspect-square border bg-[#DDE0DD] rounded-md p-2"
                      src={job.logo}
                      alt={job.company}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold pb-1">{job.position}</h3>
                    <p>{job.company}</p>
                  </div>
                </div>

                <div className="my-4 flex flex-wrap gap-2 py-1 ">
                  {job.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-[#DDE0DD]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="my-4 flex justify-between items-center   py-1">
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
      <div className="w-1/3 h-[764px] m-2  rounded-lg bg-white p-4">
        {!selectedJob ? (
          <div className="flex justify-center items-center h-full">
            <img
              src="/undraw_interview_re_e5jn.svg"
              alt="Sidebar Image"
              className="max-w-full max-h-full rounded-lg"
            />
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <img
              className="h-20 w-20 aspect-square bg-[#DDE0DD] rounded-md my-2 p-4"
              src={selectedJob.logo}
              alt={selectedJob.company}
            />
            <h2 className="text-xl font-extrabold py-1">
              {selectedJob.position}
            </h2>
            <p className="text-lg">{selectedJob.company}</p>
            <p className="text-sm text-gray-500">{selectedJob.location}</p>
            <br />
            <span className="inline-flex items-center rounded-xl mb-6 px-2 py-1 text-sm font-medium text-pink-600 bg-[#FDE5EF] w-[150px]">
              + {selectedJob.totalApplications} Applications
            </span>
            <hr />
            <p className="mt-2 font-extrabold text-xl mt-4">Description</p>
            <p className="my-2 h-[100px] mb-4 overflow-scroll scrollbar-hidden">
              {selectedJob.description}
            </p>
            <hr />
            <p className="mt-2 font-extrabold text-xl mt-4">Skills</p>
            <div className="my-4 flex flex-wrap gap-2 py-1">
              {selectedJob.skills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-[#DDE0DD]"
                >
                  {skill}
                </span>
              ))}
            </div>
            <hr />
            <p className="mt-2 font-extrabold text-xl mt-4">Base Salary</p>
            <p className="text-gray-400 my-3">{selectedJob.salary}</p>
            <button className="mt-auto bg-[#FA5E9F] text-white font-bold w-full rounded-lg py-1 px-2">
              Apply Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
