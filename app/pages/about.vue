<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-display font-bold text-gray-800">About Us Content</h2>
      <p class="text-gray-500 text-sm">Manage the fellowship history and statement of faith.</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <form class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Our History</label>
          <textarea rows="6" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">The Celestial Church of Christ Students Fellowship, Medilag chapter began in...</textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Statement of Faith (List)</label>
          <textarea rows="4" class="w-full p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue">- We believe in the Holy Trinity.
- We believe in the death and resurrection of Jesus Christ.</textarea>
          <p class="text-xs text-gray-400 mt-1">Enter each point on a new line starting with a hyphen.</p>
        </div>
        <div class="pt-4 border-t border-gray-100 flex justify-end">
          <button type="button" class="bg-royalBlue text-white px-4 py-2 rounded-lg font-medium hover:bg-skyBlue transition">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>
