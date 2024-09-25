import React from "react";
const About = () => {
  return (
    <div className="container ">
      <div className="flex flex-col justify-center">
        <h1 className="text-center font-bold text-xl mt-4 mb-8">
          About 1337 System Security App
        </h1>
        <p className="text-center  w-1/2 sm:w-3/4 mx-auto my-2">
          <h3>
            <p>
              The Real-Time Survey Guards WebApp is designed to enhance
              surveillance and manage unknown individuals through a
              sophisticated system comprising two main components: the Backend
              and the Frontend.
            </p>
            <p>
              In the case of 1337 users, who are the students,guards and admins,
              students will not have access to the app. This ensures that only
              authorized personnel, such as guards and admins, can use the
              system to monitor and respond to potential security threats.
            </p>
            The application enables guards to monitor live camera feeds and
            detect unknown individuals in real time. It also provides features
            for guards to report, volunteer, or toggle the checked status of
            detected individuals. Additionally, admins have the ability to
            manage user access and oversee the overall security operations.
          </h3>
        </p>
        <p className="text-center mb-10 mx-2">
          View the source code at{" "}
          <a
            href="https://github.com/Taj/"
            className="text-purple-600 hover:text-pink-400"
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
        </p>
        <div className="flex justify-around  mt-14">
          <a
            href="https://www.linkedin.com/in/tajeddine-marmoul/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://media.licdn.com/dms/image/D5603AQHNpjW7r1A4kg/profile-displayphoto-shrink_800_800/0/1710594427423?e=1727913600&v=beta&t=Z3n9jCujsfP-E1Pqdn9SWSQdt5mwRPedfDMQrviQqSc"
              alt="Taj Eddine Marmoul"
              className="rounded-full mx-auto w-36 sm:w-28 shadow-xl"
            />
            <div className="font-semibold mt-2  mx-auto ">
              Taj Eddine Marmoul
            </div>
          </a>
          <a
            href="https://www.linkedin.com/in/wissal-ryad-9ab465255/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="https://media.licdn.com/dms/image/D4E03AQFXzcZQ_yOvBA/profile-displayphoto-shrink_800_800/0/1700928361540?e=1727913600&v=beta&t=d8VtIWqRrASbww42F2j6GCWfW-AwkubpkiF56HIou_M"
              alt="Wissal Ryad"
              className="rounded-full mx-auto w-36 sm:w-28 shadow-xl"
            />
            <div className="font-semibold mt-2   mx-auto ">Wissal Ryad</div>
          </a>
          <a
            href="https://www.linkedin.com/in/oumaima-el-hadraoui-064658217/"
            target="blank"
            rel="noreferrer"
          >
            <img
              src="https://media.licdn.com/dms/image/D5603AQGs9_-i_h6dEA/profile-displayphoto-shrink_800_800/0/1697588084371?e=1727913600&v=beta&t=y3Plr9Mf72hY8bnfppZEWHLoalpj-vYc_JX-7WDCdvw"
              alt="Oumaima El Hadraoui"
              className="rounded-full w-36 sm:w-28 mx-auto shadow-xl"
            />
            <div className="font-semibold mt-2  mx-auto ">
              Oumaima El Hadraoui
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
