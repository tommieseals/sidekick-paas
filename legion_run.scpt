-- PROJECT LEGION - Indeed Job Applications
-- Profile: 16451 Dunmoor Houston TX 77095, Salary: 75000

property searchTerms : {"IT Support Remote", "Systems Administrator Houston", "Technical Support Specialist"}
property applicationCount : 0

on run
	set totalApps to 0
	
	tell application "Safari"
		activate
		delay 1
		
		-- Make sure we have a window
		if (count of windows) = 0 then
			make new document
			delay 1
		end if
	end tell
	
	-- Process each search term
	repeat with searchTerm in searchTerms
		log "=== Searching: " & searchTerm & " ==="
		set appsFromSearch to searchAndApply(searchTerm)
		set totalApps to totalApps + appsFromSearch
	end repeat
	
	return "PROJECT LEGION COMPLETE - Total Applications: " & totalApps
end run

on searchAndApply(searchQuery)
	set appCount to 0
	set encodedQuery to my urlEncode(searchQuery)
	set searchURL to "https://www.indeed.com/jobs?q=" & encodedQuery & "&fromage=3"
	
	tell application "Safari"
		set URL of front document to searchURL
		delay 5
		
		-- Find Easy Apply jobs
		set jsFind to "
			var jobs = document.querySelectorAll('.job_seen_beacon, .jobsearch-ResultsList > li');
			var result = [];
			jobs.forEach(function(job, idx) {
				var text = job.innerText || '';
				if (text.includes('Easily apply') || text.includes('Easy Apply')) {
					result.push(idx);
				}
			});
			JSON.stringify(result.slice(0,5));
		"
		
		set easyApplyIndexes to do JavaScript jsFind in front document
		log "Found Easy Apply jobs at indexes: " & easyApplyIndexes
		
		-- Click on each Easy Apply job and attempt application
		repeat with i from 0 to 4
			try
				-- Click the job card
				set jsClick to "
					var jobs = document.querySelectorAll('.job_seen_beacon, .jobsearch-ResultsList > li');
					if (jobs[" & i & "]) {
						var link = jobs[" & i & "].querySelector('h2 a, .jobTitle a, a');
						if (link) { link.click(); 'clicked'; }
					}
				"
				do JavaScript jsClick in front document
				delay 3
				
				-- Check for Easy Apply button in job details
				set jsCheckEasy to "
					var btn = document.querySelector('button[aria-label*=\"Apply\"], button.ia-IndeedApplyButton, .easily-apply-button, [data-testid=\"apply-button\"]');
					var pageText = document.body.innerText;
					(pageText.includes('Easily apply') || pageText.includes('Easy Apply') || btn) ? 'yes' : 'no';
				"
				set hasEasy to do JavaScript jsCheckEasy in front document
				
				if hasEasy is "yes" then
					log "Attempting application #" & (appCount + 1)
					
					-- Click apply button
					set jsApply to "
						var btn = document.querySelector('button[aria-label*=\"Apply\"], button.ia-IndeedApplyButton, .easily-apply-button, [data-testid=\"apply-button\"]');
						if (btn) { btn.click(); 'clicked apply'; }
						else {
							var btns = document.querySelectorAll('button');
							for (var b of btns) {
								if (b.innerText.toLowerCase().includes('apply')) { b.click(); break; }
							}
							'clicked fallback';
						}
					"
					do JavaScript jsApply in front document
					delay 2
					
					-- Fill in form fields
					set jsFill to "
						// Address field
						var addrFields = document.querySelectorAll('input[name*=\"address\"], input[placeholder*=\"address\"], input[aria-label*=\"address\"]');
						addrFields.forEach(function(f) { 
							f.value = '16451 Dunmoor Houston TX 77095'; 
							f.dispatchEvent(new Event('input', {bubbles:true}));
						});
						
						// Salary field
						var salaryFields = document.querySelectorAll('input[name*=\"salary\"], input[placeholder*=\"salary\"], input[aria-label*=\"salary\"], input[name*=\"pay\"]');
						salaryFields.forEach(function(f) { 
							f.value = '75000'; 
							f.dispatchEvent(new Event('input', {bubbles:true}));
						});
						
						// Phone field
						var phoneFields = document.querySelectorAll('input[type=\"tel\"], input[name*=\"phone\"]');
						phoneFields.forEach(function(f) {
							if (!f.value) {
								f.value = '7138675309';
								f.dispatchEvent(new Event('input', {bubbles:true}));
							}
						});
						
						'fields filled';
					"
					do JavaScript jsFill in front document
					delay 1
					
					-- Click continue/submit
					set jsSubmit to "
						var btns = document.querySelectorAll('button[type=\"submit\"], button');
						for (var b of btns) {
							var txt = (b.innerText || '').toLowerCase();
							if (txt.includes('continue') || txt.includes('submit') || txt.includes('next') || txt.includes('apply')) {
								b.click();
								break;
							}
						}
						'submitted';
					"
					do JavaScript jsSubmit in front document
					
					set appCount to appCount + 1
					delay 2
					
					-- Go back to search results
					do JavaScript "history.back();" in front document
					delay 2
				end if
				
			on error errMsg
				log "Error: " & errMsg
			end try
		end repeat
	end tell
	
	return appCount
end searchAndApply

on urlEncode(theText)
	set encodedText to ""
	repeat with theChar in theText
		if theChar is " " then
			set encodedText to encodedText & "+"
		else
			set encodedText to encodedText & theChar
		end if
	end repeat
	return encodedText
end urlEncode
