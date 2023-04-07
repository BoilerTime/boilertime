<template>
  <main class="h-screen">
    <!--Start nav bar section-->
    <header class="bg-white">
      <nav
        class="mx-auto flex items-center justify-between py-6 px-6 md:py-8 md:px-12"
      >
        <div class="flex">
          <a href="/" class="flex items-center gap-2 md:gap-4">
            <img class="h-8 w-auto md:h-10" src="/logo.png" />
            <p class="text-md font-bold md:text-2xl">BoilerTime</p>
          </a>
        </div>
        <div>
          <a
            href="/auth/login"
            class="lg:hover:text-yellow-700 hover:underline text-md font-bold md:text-2xl"
          >
            Already a user?
          </a>
        </div>
      </nav>
    </header>
    <!--End Nav Bar, Start Main Body-->
    <div class="bg-white flex-col">
      <!--Starting Section-->
      <div
        class="flex flex-col items-center text-center gap-2 bg-yellow-500 p-14 overflow-hidden md:p-36"
      >
        <!--Title-->
        <h1 class="md:text-5xl text-2xl font-extrabold text-white">
          Your Purdue GRIT® doesn't have to include a poor schedule
        </h1>
        <h2 class="md:text-2xl text-lg font-bold text-white">
          BoilerTime is your solution to the quarterly fear of a bad schedule.
        </h2>
        <h2 class="md:text-2xl text-lg font-bold text-white">
          Quickly create perfect schedules that fit your preferences and
          maximize your semester now.
        </h2>
        <!--Statistics-->
        <div
          class="flex flex-row items-center justify-between gap-6 md:gap-10 text-white mt-8 md:mt-10"
        >
          <div>
            <h1 class="font-bold md:text-2xl text-md">
              <span class="font=extrabold md:text-6xl text-4xl">4728</span> Classes
              Available
            </h1>
          </div>
          <div>
            <h1 class="font-bold md:text-2xl text-md">
              <span class="font=extrabold md:text-6xl text-4xl">{{ users }}</span> Active
              Users
            </h1>
          </div>
          <div>
            <h1 class="font-bold md:text-2xl text-md">
              <span class="font=extrabold md:text-6xl text-4xl">{{ ratings }}</span> Ratings
              Created
            </h1>
          </div>
          <div>
            <h1 class="font-bold md:text-2xl text-md">
              <span class="font=extrabold md:text-6xl text-4xl">11</span> Schedules Made
            </h1>
          </div>
        </div>
        <!--Sign up button-->
        <div class="pt-12 md:pt-16">
          <a
            href="/auth/register"
            class="justify-center text-lg md:text-2xl font-bold text-black rounded-lg md:px-5 md:py-4 px-4 py-3 bg-white hover:bg-gray-200"
            >Sign Up</a
          >
        </div>
      </div>
      <!--Transition to content-->
      <div
        class="aspect-[900/300] w-full bg-cover bg-center bg-no-repeat bg-[url('/yellow-to-white-down-wave.svg')]"
      ></div>
      <!--Functionality-->
      <div class="bg-white md:pb-36 md:px-36 pb-14 px-14 flex flex-col md:gap-12 gap-8">
        <img
          src="/Create-Schedule-Page.png"
          class="flex place-self-center max-w-sm max-h-sm md:max-w-6xl md:max-h-6xl md:mb-12 shadow-lg rounded-lg"
        />
        <div>
          <h1 class="md:text-6xl text-3xl text-center font-extrabold text-black md:mb-14">
            What does BoilerTime do?
          </h1>
        </div>
        <div class="flex md:flex-row flex-col justify-between gap-4">
          <div class="items-start max-w-md flex-grow">
            <UserGroupIcon class="md:h-10 md:w-10 h-8 w-8 text-yellow-500" />
            <h1 class="md:text-lg text-md font-medium">Friend Groups</h1>
            <hr/>
            <p class="md:text-md text-sm font-light">
              BoilerTime allows for you to connect with your friends so that you
              all can get the perfect schedule. Together.
            </p>
          </div>
          <div class="items-start max-w-md flex-grow">
            <UserIcon class="md:h-10 md:w-10 h-8 w-8 text-yellow-500" />
            <h1 class="md:text-lg text-md font-medium">Personal Profiles</h1>
            <hr/>
            <p class="md:text-md text-sm font-light">
              In BoilerTime, when you sign up an account, you get a personal
              profile page where you can see the classes you've bookmarked and
              see your ratings that you have made.
            </p>
          </div>
          <div class="items-start max-w-md flex-grow">
            <StarIcon class="md:h-10 md:w-10 h-8 w-8 text-yellow-500" />
            <h1 class="md:text-lg text-md font-medium">User Ratings</h1>
            <hr/>
            <p class="md:text-md text-sm font-light">
              BoilerTime allows for users to rate important aspects of your
              college classes: teaching assistants, classrooms, and courses.
            </p>
          </div>
        </div>
        <div class="flex md:flex-row flex-col justify-between gap-4">
          <div class="items-start max-w-md flex-grow">
            <MoonIcon class="md:h-10 md:w-10 h-8 w-8 text-yellow-500" />
            <h1 class="md:text-lg text-md font-medium">Website Themes</h1>
            <hr/>
            <p class="md:text-md text-sm font-light">
              Don't like light mode? Don't worry. BoierTime has the night owls
              covered with a dark mode theme.
            </p>
          </div>
          <div class="items-start max-w-md flex-grow">
            <RectangleGroupIcon class="md:h-10 md:w-10 h-8 w-8 text-yellow-500" />
            <h1 class="md:text-lg text-md font-medium">Central Hub</h1>
            <hr/>
            <p class="md:text-md text-sm font-light">
              BoilerTime has a central hub for you to access information about
              the information that is important to you. For example, you can
              look up TAs as you need.
            </p>
          </div>
          <div class="items-start max-w-md flex-grow">
            <MagnifyingGlassIcon class="md:h-10 md:w-10 h-8 w-8 text-yellow-500" />
            <h1 class="md:text-lg text-md font-medium">Detailed Class Information</h1>
            <hr>
            <p class="md:text-md text-sm font-light">
              BoilerTime gives you more than just a schedule of classes. It
              prepares you for anything. You can find information about where
              your class will be and what professor will be teaching that class.
            </p>
          </div>
        </div>
      </div>
      <!--How to use-->
      <div class="bg-white md:p-36 p-14 flex flex-col">
        <div>
          <h1 class="md:text-6xl text-3xl font-extrabold text-black md:mb-14 mb-8 text-center">
            How do you use BoilerTime?
          </h1>
        </div>
        <div class="flex md:flex-row-reverse flex-col items-center md:gap-12 gap-8 justify-between">
            <div class="flex">
                <img src="/Create-Photo.png" class="shadow-lg rounded-lg max-w-sm max-h-sm md:max-w-2xl md:max-h-2xl"/>
            </div>
          <div class="flex flex-col md:gap-12 gap-4 md:mt-10">
            <p class="md:text-3xl text-md font-bold">
              First, after signing up or logging in, click to create your
              schedule on the home page.
            </p>
            <p class="md:text-3xl text-md font-bold">
              Next, choose the classes that you want to take and need to take
              and what you want out of your schedule.
            </p>
            <p class="md:text-3xl text-md font-bold">
              That's it! You should be presented with your schedule after we
              have finished generating it for you. Feel free to access the other
              features that we have provided for you!
            </p>
          </div>
        </div>
      </div>
      <!--FAQ, working on right now, fix chevron icons-->
      <div class="bg-white md:pt-36 md:px-36 pt-14 px-14 flex flex-col">
        <div>
          <h1 class="md:text-6xl text-2xl text-center font-extrabold text-black md:mb-14">
            Frequently Asked Questions
          </h1>
        </div>
        <div class="w-full md:pt-12 pt-8">
          <div
            class="mx-auto w-full rounded-2xl bg-gradient-to-r from-indigo-400 to-indigo-200 p-4"
          >
            <Disclosure v-slot="{ open }">
              <DisclosureButton
                class="flex w-full justify-between rounded-lg bg-yellow-100 px-4 py-2 text-left md:text-lg text-md font-light hover:bg-yellow-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
              >
                <span>How does BoilerTime generate my schedule?</span>
                <ChevronUpIcon
                  :class="open ? 'rotate-180 transform' : ''"
                  class="h-5 w-5 text-black"
                />
              </DisclosureButton>
              <DisclosurePanel class="px-4 pt-4 pb-2 md:text-lg text-sm text-center">
                BoilerTime uses an in house algorithm that takes all the
                accounts and prefrences that you have put in and generates a
                schedule that fits your needs. We also use Purdue's course
                catalog to make sure that you are able to take the classes that
                you want to take. We get the times that the classes are offered
                from the course catalog and then the algorithm generates a
                schedule that fits your needs by a method similar to that of
                evolution.
              </DisclosurePanel>
            </Disclosure>
            <Disclosure as="div" class="mt-4" v-slot="{ open }">
              <DisclosureButton
                class="flex w-full justify-between rounded-lg bg-yellow-100 px-4 py-2 text-left md:text-lg text-md font-light hover:bg-yellow-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
              >
                <span>When should I use BoilerTime?</span>
                <ChevronUpIcon
                  :class="open ? 'rotate-180 transform' : ''"
                  class="h-5 w-5 text-black"
                />
              </DisclosureButton>
              <DisclosurePanel class="px-4 pt-4 pb-2 md:text-lg text-sm text-center">
                You should use BoilerTime after meeting with your course advisor
                and before the deadline to register for classes closes. This way
                you can make sure that you are able to take the classes that you
                want to take and that you are able to take them at the times
                that you want to take them.
              </DisclosurePanel>
            </Disclosure>
            <Disclosure as="div" class="mt-4" v-slot="{ open }">
              <DisclosureButton
                class="flex w-full justify-between rounded-lg bg-yellow-100 px-4 py-2 text-left md:text-lg text-md font-light hover:bg-yellow-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
              >
                <span>How often do the schedules get updated?</span>
                <ChevronUpIcon
                  :class="open ? 'rotate-180 transform' : ''"
                  class="h-5 w-5 text-black"
                />
              </DisclosureButton>
              <DisclosurePanel class="px-4 pt-4 pb-2 md:text-lg text-sm text-center">
                The schedule list gets updated in conjunction with the course
                catalog release dates. This means that the schedules get updated
                every semester.
              </DisclosurePanel>
            </Disclosure>
            <Disclosure as="div" class="mt-4" v-slot="{ open }">
              <DisclosureButton
                class="flex w-full justify-between rounded-lg bg-yellow-100 px-4 py-2 text-left md:text-lg text-md font-light hover:bg-yellow-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
              >
                <span
                  >How should I get in touch with you guys if I have any
                  problems?</span
                >
                <ChevronUpIcon
                  :class="open ? 'rotate-180 transform' : ''"
                  class="h-5 w-5 text-black"
                />
              </DisclosureButton>
              <DisclosurePanel class="px-4 pt-4 pb-2 md:text-lg text-sm text-center">
                We're currently working on a way to get in touch with us. For
                now, you can email us
                <a
                  href="mailto:lai152@purdue.edu"
                  class="hover:underline hover:text-neutral-600"
                  >here</a
                >.
              </DisclosurePanel>
            </Disclosure>
          </div>
        </div>
      </div>
      <!--Transition to ending section-->
      <div
        class="aspect-[900/300] w-full bg-cover bg-center bg-no-repeat bg-[url('/purple-to-white-up-wave.svg')]"
      ></div>
      <!--Ending section-->
      <div
        class="flex flex-row items-center justify-center md:gap-72 gap-24 bg-indigo-500 p-14 md:p-36 overflow-hidden"
      >
        <div class="flex flex-col gap-2">
          <p class="md:text-3xl text-lg font-bold text-white text-center">Finished reading?</p>
          <hr/>
          <p class="md:text-3xl text-md font-bold text-white text-center">
            Are you ready to create your perfect schedule?
          </p>
        </div>
        <div class="flex">
          <a
            href="/auth/register"
            class="md:text-2xl text-lg font-bold text-black rounded-lg md:px-5 px-4 md:py-4 py-3 bg-white hover:bg-gray-200 text-center"
            >Sign Up</a
          >
        </div>
      </div>
    </div>
    <!--End main body, start footer-->
    <footer class="bg-white">
      <div class="mx-auto md:py-8 md:px-12 text-xs md:text-sm text-center font-light p-4">
        © 2023 | BoilerTime. All rights reserved. BoilerTime is a project
        created for Purdue University, CS307: Sofware Engineering I.
      </div>
    </footer>
    <!--End Footer-->
  </main>
</template>

<!--Start Scripting Section -->
<script setup>
import { ref } from "vue";
import axios from "axios";
import {
  ChevronUpIcon,
  UserGroupIcon,
  UserIcon,
  StarIcon,
  MoonIcon,
  RectangleGroupIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/solid";
import { Disclosure, DisclosurePanel, DisclosureButton } from "@headlessui/vue";

var users = ref();
var schedules = ref();
var ratings = ref();

async function getUsers() {
  await axios
    .post("http://localhost:3001/api/get/num_users", {})
    .then((res) => {
      users.value = res.data.num_users;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getRatings() {
  await axios
    .post("http://localhost:3001/api/get/num_ratings", {})
    .then((res) => {
      ratings.value = res.data.num_ratings;
    })
    .catch((err) => {
      console.log(err);
    });
}
function getSchedules() {
  axios
    .post("http://localhost:3001/api/get/num_schedules", {})
    .then((res) => {
      schedules.value = res.data.num_schedules;
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(async () => {
  getUsers();
  getRatings();
  getSchedules();
});
</script>