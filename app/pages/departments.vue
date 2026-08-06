<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-display font-bold text-gray-800">Departments & Units</h2>
        <p class="text-gray-500 text-sm">Manage the various units in the fellowship.</p>
      </div>
      <button class="bg-royalBlue text-white px-4 py-2 rounded-lg font-medium hover:bg-skyBlue transition flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Add Department
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="font-bold text-xl text-royalBlue">Choir Unit</h3>
          <div class="space-x-2">
            <button class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
            <button class="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
          </div>
        </div>
        <p class="text-gray-600 text-sm">The choir leads the fellowship in spiritual hymns and high praise.</p>
      </div>
      
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="font-bold text-xl text-royalBlue">Media Unit</h3>
          <div class="space-x-2">
            <button class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
            <button class="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
          </div>
        </div>
        <p class="text-gray-600 text-sm">Handles all sound, projection, and digital footprint of the fellowship.</p>
      </div>
    </div>
  </div>
</template>
