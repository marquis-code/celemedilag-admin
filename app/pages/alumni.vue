<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Alumni Directory</h2>
        <p class="text-gray-500 text-sm">Manage registered alumni and their details.</p>
      </div>
      <button class="bg-royalBlue text-white px-4 py-2 rounded-lg font-medium hover:bg-skyBlue transition flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Add Alumnus
      </button>
    </div>

    <!-- Search/Filter -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex space-x-4">
      <input type="text" placeholder="Search by name or email..." class="flex-grow p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue text-sm">
      <select class="p-2 border border-gray-300 rounded-md focus:ring-royalBlue focus:border-royalBlue text-sm">
        <option>All Sets (Years)</option>
        <option>2023</option>
        <option>2022</option>
        <option>2021</option>
      </select>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Graduation Year</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profession/Location</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">Dr. Sarah Cole</div>
              <div class="text-sm text-gray-500">sarah@example.com</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">Class of 2020</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">Pediatrician - Lagos</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
              <button class="text-red-600 hover:text-red-900">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
