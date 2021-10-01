
var sample_data = {
	sections : 
		[ {"class_number":"16476",
			"subject":"COMP",
			"catalog_number":"122",
			"section_number":"01",
			"title":"Computer Architecture and Assembly Language",
			"course_id":24324,
			"description":"Some description",
			"units":"2",
			"term":"Fall-2020",
			"class_type":"LEC",
			"enrollment_cap":30,
			"enrollment_count":30,
			"waitlist_cap":0,
			"waitlist_count":0,
			"meetings":[
			   {"meeting_number":1,"location":"ONLINE","start_time":"1400h","end_time":"1425h","days":"TR"}
			],
		    "instructors":[{"instructor":"mohammed.abdelrahim@csun.edu"}]
		  }
		]
	}

var something = new Vue ({
    el: '#filters',
    data: {
      includedSubjects: [],
      excludedSubjects: [],
      includedLevels: [],
      includedLocations: [],
      includedDaysTimes: [],
      startTime: 700, endTime: 2200,
      includedInstructors: [],
      excludedInstructors: []
    }





})

var title = new Vue ({
	el: '#title',
	data: {
	 title: "Class Search: API Consumption"
	}
})

var terms = new Vue ( {
	el: '#terms',
	data: {
		current_term: "Fall-2020", 
		next_term: "Spring-2021", 
		last_term: "Spring-2020",

		this_term: "Fall-2020"  // need to know how to update
	}
})

var app = new Vue ( {
		el: '#sections_available',
	   	data: {
	   		sections: null // class_data.sections
	   	},

		mounted: function() {
			fetch('https://www.sandbox.csun.edu/~steve/class-search/data/api-comp.json')
	   		.then(response => response.json())
	   		.then(data => {
	   			this.sections = data.classes;

	   		})	   		
	   }
})
