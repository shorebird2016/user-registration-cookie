//JS code to handle registration
//user clicks button to submit form
function register(event) {
   //check name length, chars
   var login_name = document.getElementById('name-id').value;
   if (login_name === '' || login_name.length < 5) {//check length, alphanumeric
      var msg = "Name must be at least 5 characters.  Please re-enter.";
      showError('name-id', msg);
      return false;//NOTE- must return false here to not continue
   }
   var alpha_numeric = /^[a-zA-z0-9-_]+$/.test(login_name);
   if (!alpha_numeric) {
      msg = "Name must contain alpha-numeric, dash, underscore characters.  Please re-enter.";
      showError('name-id', msg);
      return false;
   }

   //validate 2 passwords are identical
   var pwd1 = document.getElementById('pwd-id').value;
   var pwd2 = document.getElementById('pwd-confirm-id').value;
   if (pwd1 !== pwd2) {
      msg = "Passwords do not confirm.  Please check.";
      showError('pwd-id', msg);
      return false;//NOTE- must return false here to not continue
   }

   //user must click agree
   var agree = document.getElementById('agree-id').checked;
   if (!agree) {
      msg = "You must agree to the term of registration.  Please check the checbox";
      showError('agree-id', msg);
      return false;//NOTE- must return false here to not continue
   }

   //success validation, populate summary form, hide form, show summary
   var elems = document.getElementsByClassName('field-confirm');
   elems[0].innerHTML = "Login name  ==>  " + login_name;
   elems[1].innerHTML = "Password  ==>  " + pwd1;
   var email = document.getElementById('email-id').value;
   elems[2].innerHTML = "Email  ==>  " + email;
   elems[3].innerHTML = "Country  ==>  " + getSelectedText('country-id');
   elems[4].innerHTML = "State  ==>  " + getSelectedText('state-id');
   elems[5].innerHTML = "City  ==>   " + getSelectedText('city-id');
   var genders = document.getElementsByName('gender');
   var gv = genders[0].value;
   if (genders[1].checked)
      gv = genders[1].value;
   elems[6].innerHTML = "Gender  ==>   " + gv;
   document.getElementById('register-id').style.display = 'none';//hide register block
   document.getElementById('summary-id').style.display = 'block';//show confirm block

   //save user information in cookie
   var new_email = "user-email=" + email;
   var new_pwd = "password=" + pwd1;
   document.cookie = "PADDING=DUMMY";
   document.cookie = new_email;
   document.cookie = new_pwd;
   console.log(document.cookie);
   return false;//don't submit//NOTE- must return false here to not reload form
}

//retrieve selected option values from a combobox
function getSelectedText(combo_id) {
   var combo_element = document.getElementById(combo_id);
   var sel_idx = combo_element.selectedIndex;
   return combo_element.options[sel_idx].text;
}

//show error message at end of form, also make border of error field red color
function showError(field_id, msg) {
   var elem_field = document.getElementById(field_id);
   if (elem_field)
      elem_field.style.borderColor = 'red';
   var elem_form = document.getElementsByTagName('form')[0];
   var elem_err = document.getElementById('errmsg-id');
   if (!elem_err) {//not found
      var elem_p = document.createElement('p');
      elem_p.id = 'errmsg-id';
      elem_p.style.color = 'red';
      elem_p.innerHTML = msg;
      elem_form.appendChild(elem_p);
   }
   else {
      elem_p.innerHTML = msg;
   }
}

const stateList = [
   { country: 'US', state: ['CA', 'NV', 'OR' ] },
   { country: 'China', state: ['Canton', 'Sichuan', 'Shandong' ] },
   { country: 'Canada', state: ['Ontario', 'Alberta', 'Quebec' ] }
];
const cityList = [
   { state: 'CA', city: ['San Francisco', 'San Jose', 'Los Angeles' ] },
   { state: 'NV', city: ['Las Vegas', 'Reno', 'Carson City' ] },
   { state: 'OR', city: ['Portland', 'Salem', 'Beaverton' ] },
   { state: 'Canton', city: ['Guangzhou', 'Foshan', 'Shenzhen' ] },
   { state: 'Shandong', city: ['Jinan', 'Qingdao', 'Yantai' ] },
   { state: 'Sichuan', city: ['Chengdu', 'Mianyang', 'Nanchong' ] },
   { state: 'Ontario', city: ['Upland', 'Pomona', 'Fontana' ] },
   { state: 'Alberta', city: ['McMurray', 'Edmonton', 'Calgary' ] },
   { state: 'Quebec', city: ['Wendake', 'Shannon', 'Beaumont' ] }
];

//change listener for state combo
function stateChange(evt) {
    var cur_state = evt.target.options[evt.target.selectedIndex].value;
    handleStateChange(cur_state);
}

//helper to find city list, null returned if not found
function findCityList(state) {
   for (var idx = 0; idx < cityList.length; idx++) {
      var st = cityList[idx].state;
      if (st === state)
         return cityList[idx].city;
   }
   return null;
}

function handleStateChange(cur_state) {
   var citylist = findCityList(cur_state);
   var elem_select_city = document.getElementById('city-id');
   elem_select_city.innerHTML = '';//remove all
   citylist.forEach(function (item, index) {//append children of options
      elem_select_city.options[index] = new Option(item, item);
   })
}

function countryChanged(evt) {
    var cur_country = evt.target.options[evt.target.selectedIndex].value;
    var state_list = findStateList(cur_country);
    var elem_state_select = document.getElementById('state-id');
    elem_state_select.innerHTML = '';
    state_list.forEach(function (item, index) {
        elem_state_select.options[index] = new Option(item, item);
    });
    handleStateChange(state_list[0]);
}

//helper to find state list, null returned if not found
function findStateList(country) {
   for (var idx = 0; idx < stateList.length; idx++) {
      var ct = stateList[idx].country;
      if (ct === country)
         return stateList[idx].state;
   }
   return null;
}

//helper to find a string in cookie array
function getCookieValue(key) {
    var cookies = document.cookie.split(';');//TODO can cookies be null?
    for (var idx = 0; idx < cookies.length; idx++) {
        var item_kv = cookies[idx].split('=');
        if (item_kv[0].trim() === key) {//some spaces are kept after split
            return item_kv[1];
        }
    }
    return null;
}

function login() {
    var email = document.getElementById('email-id').value;
    var passwd = document.getElementById('pwd-id').value;
    var usr_email = getCookieValue("user-email");
    var pwd = getCookieValue("password");
    if (email === usr_email && passwd === pwd)
        window.location = "home.html";
    else
        document.getElementById('msg-dlg-id').style.display = 'block';
    return false;//don't let form submit
}