import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const teamMembers = [
    {
      name: "arjanjohan",
      image: "/pfp/milady.png",
      description: "dev",
      github: "https://github.com/arjanjohan",
      twitter: "https://twitter.com/arjanjohan",
    },
  // Add more team members here if needed
];

const TeamComponent = () => {
  const columns = Math.min(teamMembers.length, 6);
  const gridClasses = `grid grid-cols-1 sm:grid-cols-${columns} gap-4 mt-6`;

  return (
    <div className="flex flex-col items-center mt-24">
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-center">
            <h2 className="card-title">Built by:</h2>
          </div>
          <div className={gridClasses}>
            {teamMembers.map((member, index) => (
              <div key={index} className="card bg-base-200 shadow-md p-4 flex flex-col items-center">
                <div className="w-24 h-24 mb-4 overflow-hidden rounded-full">
                  <img src={member.image} alt={member.name} className="object-cover w-full h-full" />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-center">{member.description}</p>
                <div className="flex mt-4 space-x-4">
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer">
                      <FaGithub className="text-2xl text-gray-800 hover:text-gray-600" />
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                      <FaXTwitter className="text-2xl text-gray-800 hover:text-blue-400" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamComponent;
