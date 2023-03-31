<template>
  <main class="h-screen">
    <!--Container for the home nav bar-->
    <header class="bg-white">
      <!--Nav-->
      <nav class="mx-auto flex items-center justify-between py-8 px-12">
        <!--Logo-->
        <div class="flex">
          <a href="/app/landing" class="flex items-center gap-4">
            <img class="h-10 w-auto" src="/logo.png" />
            <p class="text-2xl font-bold">BoilerTime</p>
          </a>
        </div>
        <div class="justify-end">
          <a
            href="/auth/login"
            class="justify-end hover:text-yellow-700 text-lg font-bold text-black"
          >
            Already a user?
          </a>
        </div>
      </nav>
    </header>
    <!--Main Body-->
    <div class="bg-white flex-col overflow-x-auto">
      <!--Hero, Sign up-->
      <div
        class="flex flex-col items-center text-center gap-2 bg-yellow-500 p-36"
      >
        <!--Title-->
        <h1 class="text-5xl font-extrabold text-white">
          Your Purdue GRIT® doesn't have to include a poor schedule
        </h1>
        <h2 class="text-2xl font-bold text-white">
          BoilerTime is your solution to the quarterly fear of a bad schedule.
        </h2>
        <h2 class="text-2xl font-bold text-white outline-black">
          Quickly create perfect schedules that fit your preferences and
          maximize your semester now.
        </h2>
        <!--Live counting statistic-->
        <!--Sign up button-->
        <div class="pt-16">
          <a
            href="/auth/register"
            class="justify-center text-2xl font-bold text-black rounded-lg px-5 py-4 bg-white hover:bg-gray-200"
            >Sign Up</a
          >
        </div>
      </div>
      <!--Transition to content-->
      <div
        class="aspect-[900/300] w-full bg-cover bg-center bg-no-repeat bg-[url('/yellow-to-white-down-wave.svg')]"
      ></div>
      <!--Functionality-->
      <div class="bg-white pb-36 px-36 flex flex-col gap-12">
        <div>
          <h1 class="text-6xl font-extrabold text-black mb-14">
            What does BoilerTime do?
          </h1>
        </div>
        <div class="flex flex-row justify-between">
          <div class="items-start max-w-md flex-grow">
            <UserGroupIcon class="h-10 w-10 text-yellow-500" />
            <h1 class="text-lg font-medium">Friend Groups</h1>
            <p class="text-md font-light">
              BoilerTime allows for you to connect with your friends so that you
              all can get the perfect schedule. Together.
            </p>
          </div>
          <div class="items-start max-w-md flex-grow">
            <UserIcon class="h-10 w-10 text-yellow-500" />
            <h1 class="text-lg font-medium">Personal Profiles</h1>
            <p class="text-md font-light">
              In BoilerTime, when you sign up an account, you get a personal
              profile page where you can see the classes you've bookmarked and
              see your ratings that you have made.
            </p>
          </div>
          <div class="items-start max-w-md flex-grow">
            <StarIcon class="h-10 w-10 text-yellow-500" />
            <h1 class="text-lg font-medium">User Ratings</h1>
            <p class="text-md font-light">
              BoilerTime allows for users to rate important aspects of your
              college classes: teaching assistants, classrooms, and courses.
            </p>
          </div>
        </div>
        <div class="flex flex-row justify-between">
          <div class="items-start max-w-md flex-grow">
            <MoonIcon class="h-10 w-10 text-yellow-500" />
            <h1 class="text-lg font-medium">Website Themes</h1>
            <p class="text-md font-light">
              Don't like light mode? Don't worry. BoierTime has the night owls
              covered with a dark mode theme.
            </p>
          </div>
          <div class="items-start max-w-md flex-grow">
            <RectangleGroupIcon class="h-10 w-10 text-yellow-500" />
            <h1 class="text-lg font-medium">Central Hub</h1>
            <p class="text-md font-light">
              BoilerTime has a central hub for you to access information about
              the information that is important to you. For example, you can
              look up TAs as you need.
            </p>
          </div>
          <div class="items-start max-w-md flex-grow">
            <MagnifyingGlassIcon class="h-10 w-10 text-yellow-500" />
            <h1 class="text-lg font-medium">Detailed Class Information</h1>
            <p class="text-md font-light">
              BoilerTime gives you more than just a schedule of classes. It
              prepares you for anything. You can find information about where
              your class will be and what professor will be teaching that class.
            </p>
          </div>
        </div>
      </div>
      <!--How to use-->
      <div class="bg-white p-36 flex flex-col">
        <div>
          <h1 class="text-6xl font-extrabold text-black mb-14">
            How do you use BoilerTime?
          </h1>
        </div>
        <div class="flex flex-col justify-start gap-12 mt-10">
          <p class="text-3xl font-bold">
            First, after signing up or logging in, click to create your schedule
            on the home page.
          </p>
          <p class="text-3xl font-bold">
            Next, choose the classes that you want to take and need to take and
            what you want out of your schedule.
          </p>
          <p class="text-3xl font-bold">
            That's it! You should be presented with your schedule after we have
            finished generating it for you. Feel free to access the other
            features that we have provided for you!
          </p>
        </div>
      </div>
      <!--FAQ-->
      <div class="bg-white pt-36 px-36 flex flex-col">
        <div>
          <h1 class="text-6xl font-extrabold text-black mb-14">
            Frequently Asked Questions
          </h1>
        </div>
        <div class="w-full pt-12">
          <div class="mx-auto w-full rounded-2xl bg-indigo-200 p-4">
            <Disclosure v-slot="{ open }">
              <DisclosureButton
                class="flex w-full justify-between rounded-lg bg-yellow-100 px-4 py-2 text-left text-lg font-light hover:bg-yellow-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
              >
                <span>How does BoilerTime generate my schedule?</span>
                <ChevronUpIcon
                  :class="open ? 'rotate-180 transform' : ''"
                  class="h-5 w-5 text-black"
                />
              </DisclosureButton>
              <DisclosurePanel class="px-4 pt-4 pb-2 text-lg">
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
                class="flex w-full justify-between rounded-lg bg-yellow-100 px-4 py-2 text-left text-lg font-light hover:bg-yellow-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
              >
                <span>When should I use BoilerTime?</span>
                <ChevronUpIcon
                  :class="open ? 'rotate-180 transform' : ''"
                  class="h-5 w-5 text-black"
                />
              </DisclosureButton>
              <DisclosurePanel class="px-4 pt-4 pb-2 text-lg">
                You should use BoilerTime after meeting with your course advisor
                and before the deadline to register for classes closes. This way
                you can make sure that you are able to take the classes that you
                want to take and that you are able to take them at the times
                that you want to take them.
              </DisclosurePanel>
            </Disclosure>
            <Disclosure as="div" class="mt-4" v-slot="{ open }">
              <DisclosureButton
                class="flex w-full justify-between rounded-lg bg-yellow-100 px-4 py-2 text-left text-lg font-light hover:bg-yellow-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
              >
                <span>How often do the schedules get updated?</span>
                <ChevronUpIcon
                  :class="open ? 'rotate-180 transform' : ''"
                  class="h-5 w-5 text-black"
                />
              </DisclosureButton>
              <DisclosurePanel class="px-4 pt-4 pb-2 text-lg">
                The schedule list gets updated in conjunction with the course
                catalog release dates. This means that the schedules get updated
                every semester.
              </DisclosurePanel>
            </Disclosure>
            <Disclosure as="div" class="mt-4" v-slot="{ open }">
              <DisclosureButton
                class="flex w-full justify-between rounded-lg bg-yellow-100 px-4 py-2 text-left text-lg font-light hover:bg-yellow-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
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
              <DisclosurePanel class="px-4 pt-4 pb-2 text-lg">
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
      <!--Transition to footer-->
      <div
        class="aspect-[900/300] w-full bg-cover bg-center bg-no-repeat bg-[url('/purple-to-white-up-wave.svg')]"
      ></div>
      <!--Ending, Second sign up attempt-->
      <div
        class="flex flex-row items-center justify-center gap-72 bg-indigo-500 p-36"
      >
        <div class="flex flex-col">
          <p class="text-3xl font-bold text-white">Finished reading?</p>
          <p class="text-3xl font-bold text-white">
            Are you ready to create your perfect schedule?
          </p>
        </div>
        <div class="flex">
          <a
            href="/auth/register"
            class="text-2xl font-bold text-black rounded-lg px-5 py-4 bg-white hover:bg-gray-200"
            >Sign Up</a
          >
        </div>
      </div>
    </div>
    <footer class="bg-white">
      <div
        class="mx-auto flex items-center justify-between py-8 px-12 text-sm font-light"
      >
        © 2023 | BoilerTime. All rights reserved. BoilerTime is a project
        created for Purdue University, CS307: Sofware Engineering I.
      </div>
    </footer>
  </main>
</template>
<script setup>
import { ref } from "vue";
import {} from "@heroicons/vue/24/outline";
import {
  ChevronUpIcon,
  UserGroupIcon,
  UserIcon,
  StarIcon,
  MoonIcon,
  RectangleGroupIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/solid";
import {
  TransitionRoot,
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
} from "@headlessui/vue";
</script>
