<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-display font-bold text-gray-800">Contact & Socials</h2>
      <p class="text-gray-500 text-sm">Manage fellowship location, contact info, and social media links.</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <form class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
            <input type="text" value="CMUL/LUTH Campus, Idi-Araba, Lagos" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" value="info@celemedilag.org" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input type="text" value="+234 800 000 0000" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Meeting Days/Times</label>
            <input type="text" value="Sundays 9AM, Wednesdays 6PM" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
        </div>

        <h3 class="font-bold text-gray-800 pt-6 border-t border-gray-100 mt-6">Social Media Links</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input type="url" placeholder="https://instagram.com/..." class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Twitter (X) URL</label>
            <input type="url" placeholder="https://twitter.com/..." class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">
          </div>
        </div>

        <div class="pt-6 flex justify-end">
          <button type="button" class="bg-royalBlue text-white px-4 py-2 rounded-lg font-medium hover:bg-skyBlue transition">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>
