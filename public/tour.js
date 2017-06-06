var tour = new Tour({
  steps: [
  {
    element: "#book-button",
    title: "Add a book!",
    content: "Add a book into your library!",
    placement: "bottom"
  },
  {
    element: "#create-book-form",
    title: "Create your book here!",
    content: "Add the book title and the number of pages, then click \"Add\".",
    path: "/create-book",
    placement: "bottom",
    reflex: true,
    backdrop: true,
  },
  {
    element: "#timer-button",
    title: "Set a timer!",
    content: "Click the \"Start Reading Timer!\" button to set a timer.",
    placement: "top",
    path: "/dashboard"
  },
  {
    element: "#timer-setup",
    title: "Configure and read!",
    content: "Type in the amount of time you want to read, as well as for which book you are reading for. Click the \"Let's Read!\" button to start the timer.",
    placement: "bottom",
    reflex: true,
    path: "/timer"    
  },
  {
    element: "#stop-timer",
    title: "Read or stop!",
    content: "Read until your timer is up or click the \"Stop Timer\" button to stop your timer and head to the notes section, so that you can write down what you read.",
    //Stopped right here. Trying to figure out why comments don't show up
    orphan: true,
    path: "/timer/example",
  },
  {
    element: "#" + document.getElementsByTagName('a')[4].id.toString(),
    title: "Add a note!", 
    content: "Add a note to your book",
    placement: "bottom"
  }
]});

// Initialize the tour
tour.init();

// Start the tour
tour.start(true);

tour.goTo(3);
