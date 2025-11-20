
  document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();

    emailjs.sendForm("service_s2dejmq", "template_6j7823g",this)
      .then(function(response) {
        
        console.log("SUCCESS!", response.status, response.text);
        document.getElementById("status").innerHTML="Message Sent Successfully!";
      }, function(error) {
       
        console.log("FAILED...", error);
        document.getElementById("status").innerHTML="Failed To Send Message. Try again.!";
      });

    this.reset(); 
  });