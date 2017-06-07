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
    path: "/demo/create-book",
    placement: "bottom",
    reflex: true,
    backdrop: true,
  },
  {
    element: "#timer-button",
    title: "Set a timer!",
    content: "Click the \"Start Reading Timer!\" button to set a timer.",
    placement: "top",
    path: "/demo/dashboard"
  },
  {
    element: "#timer-setup",
    title: "Configure and read!",
    content: "Type in the amount of time you want to read, as well as for which book you are reading for. Click the \"Let's Read!\" button to start the timer.",
    placement: "bottom",
    reflex: true,
    path: "/demo/set-timer",
  },
  {
    title: "Read or stop!",
    content: "Read until your timer is up or click the \"Stop Timer\" button to stop your timer and head to the notes section, so that you can write down what you read.",
    // Stopped right here. Trying to figure out why comments don't show up
    // Needed to add bootstrap tour and tour.js into the layoutTimer.hbs page
    orphan: true,
    path: "/demo/timer",
  },
  {
    element: "#demo-book",
    title: "Add or View Notes!", 
    content: "You can click this button to check or add notes. You will be redirected to the notes page when you finish the timer.",
    path: "/demo/dashboard",
    placement: "left",
    reflex: true,
  },
  {
    title: "Notes Section",
    content: "You can view, edit, and delete your notes here. Add notes by clicking the \"Create a new note\" button.",
    path: "/demo/notes/demo-book",
    orphan: true,
  },
  {
    title: "That's it!",
    content: "You can always view the demo by clicking on the link in the sandwich icon in the upper right corner.",
    orphan: true,
    path: "/dashboard",
  }
]});

// Initialize the tour
tour.init();

// Start the tour
tour.start(true);