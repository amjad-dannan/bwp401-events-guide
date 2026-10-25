/* ---------- 1) Event data ----------
   Index i in every array matches the card with id ev(i+1),
   the badge today(i+1) and the section event-(i+1) on the details page.
   These values must stay identical to the card text in the HTML. */

var eventTitles = [
  'أمسية شعرية: أصوات شابة',
  'بطولة كرة القدم بين الكليات',
  'حفل نادي الموسيقى الجامعي',
  'يوم العائلة الجامعي',
  'معرض الكتاب الجامعي',
  'بطولة الشطرنج عبر الإنترنت',
];

// Short description (same text as the card) so the search covers it
var eventDescriptions = [
  'قراءات شعرية لطلاب الجامعة تليها فقرة حوار مفتوح مع الحضور.',
  'مباريات ودية بين فرق الكليات تنتهي بمباراة نهائية وتكريم الفائزين.',
  'عروض موسيقية متنوعة يقدمها طلاب نادي الموسيقى من مختلف الكليات.',
  'يوم مفتوح لعائلات الطلاب والعاملين مع ألعاب ومسابقات للأطفال.',
  'معرض لثلاثة أيام يضم كتباً أكاديمية وأدبية بأسعار مخفضة للطلاب.',
  'بطولة مفتوحة لجميع الطلاب تُلعب عبر الإنترنت بنظام الإقصاء.',
];

var eventCategories = ['ثقافة', 'رياضة', 'موسيقى', 'عائلي', 'ثقافة', 'رياضة'];

var eventLocations = [
  'القاعة الرئيسية',
  'الملعب الجامعي',
  'القاعة الرئيسية',
  'الملعب الجامعي',
  'القاعة الرئيسية',
  'عبر الإنترنت',
];

// Dates as year-month-day (same format as the date input) so string comparison works
var eventStartDates = [
  '2026-10-14',
  '2026-10-16',
  '2026-10-18',
  '2026-10-24',
  '2026-11-02',
  '2026-11-10',
];
var eventEndDates = [
  '2026-10-14',
  '2026-10-16',
  '2026-10-18',
  '2026-10-24',
  '2026-11-04',
  '2026-11-10',
];

/* ---------- 2) Featured events slider ---------- */

var slideIds = ['slide1', 'slide2', 'slide3'];
var currentSlide = 0; // index of the slide currently shown
var slideDelay = 5000; // time each slide stays visible, in milliseconds

// Show one slide and hide the others with the display property
function showSlide(index) {
  for (var i = 0; i < slideIds.length; i++) {
    var slide = document.getElementById(slideIds[i]);
    if (i == index) {
      slide.style.display = ''; // empty value restores the default display
    } else {
      slide.style.display = 'none';
    }
  }
  currentSlide = index;
}

// Next slide, wrapping back to the first after the last
function nextSlide() {
  var next = currentSlide + 1;
  if (next >= slideIds.length) {
    next = 0;
  }
  showSlide(next);
}

// Previous slide, wrapping to the last before the first
function prevSlide() {
  var previous = currentSlide - 1;
  if (previous < 0) {
    previous = slideIds.length - 1;
  }
  showSlide(previous);
}

// Automatic advance: the function schedules itself again with setTimeout.
// It is started only once from startSlider, so there is only one timer at any time.
function autoSlide() {
  nextSlide();
  setTimeout('autoSlide()', slideDelay);
}

// Called from the onload event of the home page
function startSlider() {
  showSlide(0);
  setTimeout('autoSlide()', slideDelay);
}

/* ---------- 3) Search and filter ---------- */

// Called by the filter button and by the form submit; applies all criteria together
function filterEvents() {
  var text = document.getElementById('searchText').value;
  var category = document.getElementById('categorySelect').value;
  var fromDate = document.getElementById('dateInput').value; // "" or year-month-day
  var location = document.getElementById('locationSelect').value;
  var shownCount = 0;

  for (var i = 0; i < eventTitles.length; i++) {
    var visible = true;

    // 1- Search text: must appear in the title or the description
    if (
      text != '' &&
      eventTitles[i].indexOf(text) < 0 &&
      eventDescriptions[i].indexOf(text) < 0
    ) {
      visible = false;
    }
    // 2- Category
    if (category != 'all' && eventCategories[i] != category) {
      visible = false;
    }
    // 3- Date: hide events that ended before the chosen date, so a multi-day
    //    event stays visible while it is running. String comparison works
    //    because year-month-day keeps the chronological order.
    if (fromDate != '' && eventEndDates[i] < fromDate) {
      visible = false;
    }
    // 4- Location
    if (location != 'all' && eventLocations[i] != location) {
      visible = false;
    }

    var card = document.getElementById('ev' + (i + 1));
    if (visible) {
      card.style.display = '';
      shownCount++;
    } else {
      card.style.display = 'none';
    }
  }

  // Message when there is no result
  if (shownCount == 0) {
    document.getElementById('noResults').style.display = '';
  } else {
    document.getElementById('noResults').style.display = 'none';
  }
}

// Reset button: shows all cards; the fields are cleared automatically because the button type is reset
function showAllEvents() {
  for (var i = 0; i < eventTitles.length; i++) {
    document.getElementById('ev' + (i + 1)).style.display = '';
  }
  document.getElementById('noResults').style.display = 'none';
}

/* ---------- 4) Contact form validation ---------- */

// Is the text empty or only spaces? (\S = a non-space character)
function isBlank(text) {
  return text.search(/\S/) < 0;
}

// Basic email format: chars@chars.chars with no spaces.
// [\w\.\-] = a letter, digit, dot or dash
function isValidEmail(text) {
  return text.search(/^[\w\.\-]+@[\w\.\-]+\.[a-zA-Z]+$/) == 0;
}

// Hide all alerts before each validation attempt
function hideContactAlerts() {
  document.getElementById('successAlert').style.display = 'none';
  document.getElementById('errorName').style.display = 'none';
  document.getElementById('errorEmail').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'none';
}

// Submit handler: shows the right alert and puts the focus on the wrong field.
// Always returns false because the site has no server, so the form is never sent.
function validateContact() {
  var nameBox = document.getElementById('name');
  var emailBox = document.getElementById('email');
  var messageBox = document.getElementById('message');

  hideContactAlerts();

  if (isBlank(nameBox.value)) {
    document.getElementById('errorName').style.display = '';
    nameBox.focus();
    return false;
  }
  if (isBlank(emailBox.value) || !isValidEmail(emailBox.value)) {
    document.getElementById('errorEmail').style.display = '';
    emailBox.focus();
    emailBox.select();
    return false;
  }
  if (isBlank(messageBox.value)) {
    document.getElementById('errorMessage').style.display = '';
    messageBox.focus();
    return false;
  }

  // All fields are valid: the success message explains that nothing was actually sent
  document.getElementById('successAlert').style.display = '';
  return false;
}

// Called from onload on the contact page to attach the submit handler to the form
function initContact() {
  document.getElementById('contactForm').onsubmit = validateContact;
}

/* ---------- 5) Share an event ---------- */

// The share button is created together with the event details at the end of
// this file and calls shareEvent(id), which is defined there. An older
// shareEvent(number) that built "event.html#event-N" links was removed: the
// later function with the same name always replaced it, so it never ran.

/* ---------- 6) "Today" badge ---------- */

// Converts the number to a two-digit string
function twoDigits(number) {
  var text = String(number);
  if (number < 10) {
    text = '0' + number;
  }
  return text;
}

// Today's date as year-month-day to compare with the event dates
function todayText() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1; // getMonth returns 0 for January
  var day = today.getDate();
  return year + '-' + twoDigits(month) + '-' + twoDigits(day);
}

// Called from onload on the home and events pages.
// Shows the badge only when today falls within the event dates, otherwise it stays hidden.
function markTodayEvents() {
  var today = todayText();
  for (var i = 0; i < eventStartDates.length; i++) {
    var badge = document.getElementById('today' + (i + 1));
    if (today >= eventStartDates[i] && today <= eventEndDates[i]) {
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }
}

/* ---------- 7) Scroll-to-top button ---------- */

// The button (id topBtn) is placed once near the end of every page
var topButton = document.getElementById('topBtn');

// Called by the button's onclick: jumps back to the top of the current page
function scrollToTop() {
  window.scrollTo(0, 0);
}

// Shows the button only after the page is scrolled down more than 200px
function toggleTopButton() {
  if (document.documentElement.scrollTop > 200) {
    topButton.style.display = 'block';
  } else {
    topButton.style.display = 'none';
  }
}

// Runs every time the page is scrolled
window.onscroll = toggleTopButton;

/* ---------- 8) Event details page ---------- */

// Full data for the details page (event.html?id=N). The id matches the number
// in the links on the home and events pages.
var events = [
  {
    id: 1,
    title: 'أمسية شعرية: أصوات شابة',
    desc: 'قراءات شعرية لطلاب الجامعة تليها فقرة حوار مفتوح مع الحضور.',
    about:
      'أمسية يقرأ فيها طلاب من مختلف الكليات قصائدهم الخاصة باللغة العربية، يتخللها تعليق قصير من أحد أعضاء الهيئة التدريسية على كل نص، وتُختتم بفقرة حوار مفتوح بين الشعراء والحضور. الدخول مجاني لطلاب الجامعة وأسرهم، ويمكن للطلاب خارج المدينة متابعة الأمسية عبر البث المباشر.',
    location: 'القاعة الرئيسية (مع بث مباشر عبر الإنترنت)',
    date: '2026-10-14',
    time: '18:00 - 20:00',
    cat: 'ثقافة',
    image: './assets/img/ev1.jpg',
    gallery: {
      image_1: './assets/img/ev1.jpg',
      image_2: './assets/img/hall.jpg',
      image_3: './assets/img/online.jpg',
    },
  },
  {
    id: 2,
    title: 'بطولة كرة القدم بين الكليات',
    desc: 'بطولة ودية تشارك فيها فرق تمثل كليات الجامعة.',
    about:
      'بطولة ودية تشارك فيها فرق تمثل كليات الجامعة بنظام المجموعات ثم المباراة النهائية. تبدأ المباريات في الثالثة عصراً وتُقام المباراة النهائية في الخامسة، ويُكرَّم الفريق الفائز وأفضل لاعب في ختام اليوم. المشاهدة مجانية، ويُرجى من الجمهور الحضور قبل الموعد بربع ساعة.',
    location: 'الملعب الجامعي',
    date: '2026-10-16',
    time: '15:00 - 18:00',
    cat: 'رياضة',
    image: './assets/img/ev2.jpg',
    gallery: {
      image_1: './assets/img/ev2.jpg',
      image_2: './assets/img/stadium.jpg',
      image_3: './assets/img/online.jpg',
    },
  },
  {
    id: 3,
    title: 'حفل نادي الموسيقى الجامعي',
    desc: 'حفل موسيقي يقدم فيه الطلاب مقطوعات عربية وعالمية.',
    about:
      'حفل سنوي يقدم فيه طلاب نادي الموسيقى مقطوعات عربية وعالمية بآلات متنوعة، إضافة إلى فقرة غنائية جماعية. يُفتح باب القاعة في السادسة والنصف مساءً، والمقاعد محدودة وتُمنح بحسب أسبقية الحضور. سيُبث الحفل مباشرة لطلاب الجامعة في بقية المدن.',
    location: 'القاعة الرئيسية (مع بث مباشر عبر الإنترنت)',
    date: '2026-10-18',
    time: '19:00 - 21:00',
    cat: 'موسيقى',
    image: './assets/img/ev3.jpg',
    gallery: {
      image_1: './assets/img/ev3.jpg',
      image_2: './assets/img/hall.jpg',
      image_3: './assets/img/online.jpg',
    },
  },
  {
    id: 4,
    title: 'يوم العائلة الجامعي',
    desc: 'يوم مفتوح يتضمن ألعاباً للأطفال ومسابقات وأنشطة عائلية.',
    about:
      'يوم مفتوح لعائلات طلاب الجامعة والعاملين فيها، يتضمن ألعاباً حركية ومسابقات للأطفال، وركناً للرسم، ومسابقة ثقافية للكبار، إضافة إلى أكشاك طعام بسيطة. الدخول مجاني، ويُنصح بإحضار قبعات وماء بسبب الطقس المشمس. تنتهي الفعالية بتوزيع جوائز رمزية على الأطفال المشاركين.',
    location: 'الملعب الجامعي',
    date: '2026-10-24',
    time: '11:00 - 16:00',
    cat: 'عائلي',
    image: './assets/img/ev4.jpg',
    gallery: {
      image_1: './assets/img/ev4.jpg',
      image_2: './assets/img/stadium.jpg',
      image_3: './assets/img/hall.jpg',
    },
  },
  {
    id: 5,
    title: 'معرض الكتاب الجامعي',
    desc: 'معرض كتاب يمتد ثلاثة أيام بمشاركة دور نشر محلية.',
    about:
      'معرض يمتد ثلاثة أيام ويضم أجنحة لدور نشر محلية وركناً لكتب الطلاب المستعملة بأسعار رمزية. تُقام في اليوم الثاني ندوة قصيرة عن القراءة الرقمية، وفي اليوم الأخير جلسة توقيع لمؤلفين من أعضاء الهيئة التدريسية. يحصل طلاب الجامعة على حسم عند إبراز البطاقة الجامعية.',
    location: 'القاعة الرئيسية',
    date: '2026-11-02',
    endDate: '2026-11-04',
    time: '10:00 - 17:00',
    cat: 'ثقافة',
    image: './assets/img/ev5.jpg',
    gallery: {
      image_1: './assets/img/ev5.jpg',
      image_2: './assets/img/hall.jpg',
      image_3: './assets/img/online.jpg',
    },
  },
  {
    id: 6,
    title: 'بطولة الشطرنج عبر الإنترنت',
    desc: 'بطولة شطرنج مفتوحة لطلاب الجامعة بنظام الإقصاء المباشر.',
    about:
      'بطولة مفتوحة لجميع طلاب الجامعة تُلعب عبر الإنترنت بنظام الإقصاء المباشر، بزمن عشر دقائق لكل لاعب. يُرسَل رابط الدخول للمسجلين قبل البطولة بيوم واحد، وتُعرض المباراة النهائية على شاشة في القاعة الرئيسية لمن يرغب بالمتابعة الجماعية. يحصل الفائزون الثلاثة الأوائل على شهادات تقدير.',
    location: 'عبر الإنترنت',
    date: '2026-11-10',
    time: '20:00 - 23:00',
    cat: 'رياضة',
    image: './assets/img/ev6.jpg',
    gallery: {
      image_1: './assets/img/ev6.jpg',
      image_2: './assets/img/online.jpg',
      image_3: './assets/img/hall.jpg',
    },
  },
];

// The empty box on event.html that receives the details (null on other pages)
var containerEventDetails = document.getElementById('eventDetails');

// Reads N from the page address "event.html?id=N".
// Returns 0 when there is no id, so no event matches.
function getEventIdFromAddress() {
  var query = window.location.search.substring(1); // text after "?", e.g. "id=3"
  var parts = query.split('&');
  for (var i = 0; i < parts.length; i++) {
    if (parts[i].indexOf('id=') == 0) {
      return Number(parts[i].substring(3)); // "abc" gives NaN, which matches no event
    }
  }
  return 0;
}

// Returns the event with this id, or null when there is none
function findEventById(eventId) {
  for (var i = 0; i < events.length; i++) {
    if (events[i].id == eventId) {
      return events[i];
    }
  }
  return null;
}

// Called from the onerror attribute of each image: hides an image that failed to load
function handleImageError(img) {
  img.style.display = 'none';
}

// Bootstrap icon shown on the cover label for each category
function getCategoryIcon(category) {
  if (category == 'ثقافة') {
    return 'bi-book-half';
  } else if (category == 'رياضة') {
    return 'bi-trophy';
  } else if (category == 'موسيقى') {
    return 'bi-music-note-beamed';
  } else if (category == 'عائلي') {
    return 'bi-people';
  }
  return 'bi-calendar-event';
}

// CSS class suffix of the category badge (cat-culture, cat-sports, ...)
function getCategoryClass(category) {
  if (category == 'ثقافة') {
    return 'culture';
  } else if (category == 'رياضة') {
    return 'sports';
  } else if (category == 'موسيقى') {
    return 'music';
  } else if (category == 'عائلي') {
    return 'family';
  }
  return 'default';
}

// One line of the information box: icon, small label and value
function renderInfoItem(icon, label, value) {
  return (
    ' <div class="event-info-item">' +
    ' <span class="event-info-icon">' +
    ' <i class="bi ' + icon + '"></i>' +
    ' </span>' +
    ' <div>' +
    ' <small>' + label + '</small>' +
    ' <p>' + value + '</p>' +
    ' </div>' +
    ' </div> '
  );
}

// Builds the details of the event chosen in the address and puts them in the page.
// Shows a "not found" card when the id is missing or unknown.
function renderEventDetails() {
  if (containerEventDetails == null) {
    return;
  }

  var eventData = findEventById(getEventIdFromAddress());

  if (eventData == null) {
    containerEventDetails.innerHTML =
      '<div class="event-content-card text-center">' +
      ' <h2>الفعالية غير موجودة</h2>' +
      ' <p>لم يتم العثور على الفعالية المطلوبة.</p>' +
      ' <a href="events.html" class="btn btn-main"> العودة إلى الفعاليات </a>' +
      ' </div>';
    return;
  }

  var title = eventData.title;
  var category = eventData.cat;
  var place = eventData.location;
  var i;

  // Small gallery: one column for each image that exists
  var galleryImages = [
    eventData.gallery.image_1,
    eventData.gallery.image_2,
    eventData.gallery.image_3
  ];
  var galleryHtml = '';
  var imageNumber = 0;
  for (i = 0; i < galleryImages.length; i++) {
    if (galleryImages[i]) {
      imageNumber++;
      galleryHtml +=
        ' <div class="col-4">' +
        ' <img class="img-fluid" src="' + galleryImages[i] + '"' +
        ' alt="' + title + ' - الصورة ' + imageNumber + '"' +
        ' loading="lazy" onerror="handleImageError(this)" />' +
        ' </div> ';
    }
  }

  // Related events: up to three other events of the same category
  var relatedHtml = '';
  var relatedCount = 0;
  for (i = 0; i < events.length && relatedCount < 3; i++) {
    var other = events[i];
    if (other.id != eventData.id && other.cat == category) {
      relatedCount++;
      relatedHtml +=
        ' <div class="col-md-4">' +
        ' <div class="event-content-card h-100">' +
        ' <img src="' + other.image + '" class="img-fluid" alt="' + other.title + '"' +
        ' loading="lazy" onerror="handleImageError(this)" />' +
        ' <h4 class="mt-3">' + other.title + '</h4>' +
        ' <p>' + other.desc + '</p>' +
        ' <a class="btn btn-main mt-2" href="event.html?id=' + other.id + '"> عرض التفاصيل </a>' +
        ' </div>' +
        ' </div> ';
    }
  }
  if (relatedCount > 0) {
    relatedHtml =
      ' <section class="event-content-card mt-4">' +
      ' <h3> <i class="bi bi-calendar2-week"></i> فعاليات ذات صلة </h3>' +
      ' <div class="row g-3">' +
      relatedHtml +
      ' </div>' +
      ' </section> ';
  }

  // Embedded map searched by the place name
  var mapLink =
    'https://maps.google.com/maps?q=' +
    encodeURIComponent(place + ', Syria') +
    '&output=embed';

  containerEventDetails.innerHTML =
    '<article class="event-detail event-detail-single" id="event-' + eventData.id + '">' +
    // Heading: category badge, title and short description
    ' <div class="event-heading">' +
    ' <span class="badge cat-' + getCategoryClass(category) + '"> ' + category + ' </span>' +
    ' <h2>' + title + '</h2>' +
    ' <p>' + eventData.desc + '</p>' +
    ' </div>' +
    // Cover image and information box
    ' <div class="row g-4 align-items-stretch event-main-row">' +
    ' <div class="col-lg-7">' +
    ' <div class="event-cover">' +
    ' <img src="' + eventData.image + '" class="img-fluid" alt="' + title + '"' +
    ' width="1920" height="1152" onerror="handleImageError(this)" />' +
    ' <span class="event-cover-label">' +
    ' <i class="bi ' + getCategoryIcon(category) + '"></i>' +
    ' فعالية </span>' +
    ' </div>' +
    ' </div>' +
    ' <div class="col-lg-5">' +
    ' <div class="info-box event-info-box">' +
    ' <h3> <i class="bi bi-calendar2-event"></i> معلومات الفعالية </h3>' +
    renderInfoItem('bi-calendar3', 'التاريخ', eventData.date) +
    renderInfoItem('bi-clock', 'الوقت', eventData.time) +
    renderInfoItem('bi-geo-alt', 'المكان', place) +
    renderInfoItem('bi-ticket-perforated', 'رسوم الدخول', 'مجاني') +
    // Add to calendar (.ics file) and share buttons
    ' <div class="event-actions">' +
    ' <a id="calBtn' + eventData.id + '" href="assets/calendar/event-' + eventData.id + '.ics"' +
    ' download="event-' + eventData.id + '.ics" class="btn btn-accent">' +
    ' <i class="bi bi-calendar-plus"></i>' +
    ' أضف للتقويم </a>' +
    ' <button type="button" id="shareBtn' + eventData.id + '" class="btn btn-main"' +
    ' onclick="shareEvent(' + eventData.id + ')">' +
    ' <i class="bi bi-share"></i>' +
    ' مشاركة الفعالية </button>' +
    ' </div>' +
    ' </div>' +
    ' </div>' +
    ' </div>' +
    // Full description with gallery, and the location map
    ' <div class="row g-4 event-extra-content">' +
    ' <div class="col-lg-8">' +
    ' <section class="event-content-card">' +
    ' <h3> <i class="bi bi-info-circle"></i> عن الفعالية </h3>' +
    ' <p>' + eventData.about + '</p>' +
    ' <h3 class="mt-4"> <i class="bi bi-images"></i> صور من الفعالية </h3>' +
    ' <div class="row g-3 gallery event-gallery">' +
    galleryHtml +
    ' </div>' +
    ' </section>' +
    ' </div>' +
    ' <div class="col-lg-4">' +
    ' <aside class="event-location-card">' +
    ' <h3> <i class="bi bi-geo"></i> موقع الفعالية </h3>' +
    ' <iframe src="' + mapLink + '" width="100%" height="250" style="border:0"' +
    ' loading="lazy" title="خريطة موقع الفعالية" allowfullscreen></iframe>' +
    ' <p>' + place + '</p>' +
    ' </aside>' +
    ' </div>' +
    ' </div>' +
    relatedHtml +
    ' </article>';
}

// Called by the share button with the event number. Builds the public link of
// the event from the current page address and shows it in a prompt window,
// where the user can select and copy it. On GitHub Pages this gives
// https://username.github.io/repository-name/event.html?id=N
function shareEvent(number) {
  var address = window.location.href;
  // Remove any "#..." and "?..." part to keep only the page address
  if (address.indexOf('#') >= 0) {
    address = address.substring(0, address.indexOf('#'));
  }
  if (address.indexOf('?') >= 0) {
    address = address.substring(0, address.indexOf('?'));
  }
  // Keep the site folder (everything up to the last "/") and add the event page
  var folder = address.substring(0, address.lastIndexOf('/') + 1);
  prompt('انسخ رابط الفعالية:', folder + 'event.html?id=' + number);
}

// Runs once when main.js loads; does nothing on pages without the details box
if (containerEventDetails != null) {
  renderEventDetails();
}
