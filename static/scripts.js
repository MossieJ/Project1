// execute when DOM is fully loaded
$(document).ready(function() {
    // Hide alerts
    $(".alert-danger").hide();
    // Execute with registration submission
    $("#register").on("submit", function(event) {
        // Password mismatch
        if ($("#reg_password").val() != $("reg_conf").val()) {
                $("#regusername").hide();
                $("#regpassword").text("The password and its confirmation do not match!").show();
                $("#reg_password").focus();
                return false;
        }
        // Custom request
        $.AJAX({
            data : {
                reg_username: $("#reg_username").val(),
                reg_password: $("#reg_password").val(),
                reg_conf: $("#reg_config").val()
            },
            type: "POST",
            url: "/register"
        })
        // Execute when request is complete
        .done(function(data) {
            // Username already in branch
            if (data.error == "1") {
                $("#regpassword").hide();
        		$("#regusername").text("This username is already in use!").show();
        		$("#reg_username").focus();
            }
            // Success

            else {
                // Redirect to login page
                window.location.href = "/login";
            }
        });
        //disable default html form submission mechanism
        event.preventDefault();
    });

    // Execute when the login form is submitted
    $("#login").on("submit"), function(event) {
        //Custom request
        $.AJAX({
            data : {
                login_user: $("#login_user").val(),
                login_pw: $("#login_pw").val()
            },
            type: "POST",
            url: "/login"
        })
        // Execute when request is complete
        .done(function(data) {
            // Invalid Username branch
            if (data.error == "1") {
                $("#loginpw").hide();
                $("#loginuser").text("Invalid username!").show();
                $("#login_user").focus();
            }
            // Invalid password branch
            else if (data.error == "2") {
                $("#loginuser").hide();
                $("#loginpw").text("Invalid password!").show();
                $("#login_pw").focus();
            }
            //Success
            else {
                // Redirect user to main page
                window.location.href= "/";
            }
        });
        //Disable the Default HTML submission mechanism
        event.preventDefault();
    };

	// Execute when a review is submitted
	$("#comment").on("submit", function(event) {
		$.ajax({
            data : {
                user_comment: $("#user_comment").val(),
                rating: $("#rating").val()
            },
            type: "POST",
            url: window.location.href
        })
        // Execute when the request is complete
        .done(function(data) {
        	// Already sent a review branch
        	if (data.error == 1) {
        		$("#commenterror").text("You already commented on this book!").show();
        	}
        	// Success
        	else
        		// Reload the page
        		location.reload();
        });

        // Disable the default HTML form submission mechanism
        event.preventDefault();
	});

	// Typeahead for searching books
	$("#q").typeahead({
        highlight: false,
        minLength: 1
    },
    {
        display: function(suggestion) { return null; },
        limit: 10,
        source: search,

        templates: {
        	// Message for empty results
        	empty: [
        	"<div>" + "No matches found" + "</div"].join("\n"),
        	// Formatted results
            suggestion: Handlebars.compile(
                "<div>" +
                "{{author}}, {{title}}, {{isbn}}" +
                "</div>"
            )
        }
    });

    // Redirect user to the selected book's page
    $("#q").on("typeahead:selected", function(eventObject, suggestion, name) {

    	window.location.href = "/book/" + String(suggestion.isbn)
    });

});
// Search database for typeahead's suggestions
function search(query, syncResults, asyncResults)
{
    // Get places matching query (asynchronously)
    let parameters = {
        q: query
    };
    $.getJSON("/search", parameters, function(data, textStatus, jqXHR) {
        console.log(data);
        // Call typeahead's callback with search results (i.e., books)
        asyncResults(data);

    });
}