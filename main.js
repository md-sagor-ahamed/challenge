
const UI = {
  loadSelector(){
    const inputForm = document.querySelector(".form");
    const inputTitle = document.querySelector(".taskTitle");
    const inputDescription = document.querySelector(".taskDescription");
    const inputWorker = document.querySelector(".worker");
    const inputEndDate = document.querySelector(".endDate");
    const inputPriority = document.querySelectorAll(".priority");
    const inputStatus = document.querySelectorAll(".status");
    const inputRange = document.querySelector(".number");
    const inputRangeBox = document.querySelector(".numberBox");
    const submitBtn = document.querySelector(".submit");
    const showTotalItem = document.querySelector(".totalItem");
    const showNewItem = document.querySelector(".newItem");
    const showProgressItem = document.querySelector(".progressItem");
    const showCompletedItem = document.querySelector(".completedItem");
    const showRejectedItem = document.querySelector(".rejectedItem");
    const itemList = document.querySelector(".list");
    const fromViewer = document.querySelector(".fromViewer");
    const submitOrUpdateButton = document.querySelector(".submitOrUpdateBtn");
    const submitButton = document.querySelector(".submit");
    const updateButton = document.querySelector(".updateList");
    const hidden = document.querySelector(".hidden");
    const resetBtn = document.querySelector(".reset");
    return {
      inputForm,
      inputTitle,
      inputDescription,
      inputWorker,
      inputEndDate,
      inputPriority,
      inputStatus,
      inputRange,
      inputRangeBox,
      submitBtn,
      showTotalItem,
      showNewItem,
      showProgressItem,
      showCompletedItem,
      showRejectedItem,
      itemList,
      fromViewer,
      submitOrUpdateButton,
      submitButton,
      updateButton,
      hidden,
      resetBtn
    }
  },
  resetAllThis(){
    const {resetBtn} = this.loadSelector()
    resetBtn.addEventListener("click", ()=>{
      localStorage.clear()
      location.reload()
    })
  },
  editTheItem(){
    const {itemList, inputTitle,inputDescription, inputWorker, inputEndDate, inputPriority, inputStatus, inputRange, inputRangeBox, submitButton} = this.loadSelector();
    itemList.addEventListener("click", (e)=>{
      e.preventDefault()
      const target = e.target;
      if(target.className === "fas fa-edit taskEdit"){
        const elemId = e.target.id
        const item = e.target.parentElement.parentElement.children;
        inputTitle.value = item[0].textContent;
        inputDescription.value = item[0].id;
        inputWorker.value = item[4].textContent;
        inputEndDate.value = item[3].id;
        inputPriority.forEach(list=>{
          if(list.value === item[1].textContent){
            list.checked = true;
          }
        })
        inputStatus.forEach(list =>{
          if(list.value === item[2].textContent){
            list.checked = true;
          }
        });
        inputRange.value = item[5].textContent;
        inputRangeBox.value = item[5].textContent;
        const idElem = `<input type="hidden" class="hidden" name="id" value="${item[4].id}"/> `
        const updateBtn = `<button class="updateList">update button</button>`
        if(document.querySelector(".hidden")){
          document.querySelector(".hidden").setAttribute("value", item[4].id)
        }
        if(!document.querySelector(".updateList")){
          submitButton.insertAdjacentHTML("beforebegin", idElem);
          submitButton.insertAdjacentHTML("beforebegin", updateBtn);
        }
        submitButton.style.display = "none"
      }
    })
  },
  updateTheList(e){
    const{inputTitle, inputDescription, inputWorker,inputPriority, inputEndDate, itemList, inputRange, inputRangeBox, submitButton} = this.loadSelector();
    const listItem = this.getDataFromLocalStorage()
    const id = parseInt(e.target.previousElementSibling.value, 10);
    const getInput = this.getInputFromTheUser()
    const title = getInput.title;
    const description = getInput.description;
    const worker = getInput.worker;
    const date = getInput.date;
    const status = getInput.status;
    const priority = getInput.priority;
    const range = getInput.range;
    const currentId = parseInt(e.target.previousElementSibling.value, 10);
    if(title === "" || description === "" || worker === "" || date === "" || priority === undefined || status === undefined || range === ""){
          alert("Please check you are missing something")
    }else{
      listItem.map(items=>{
        if(items.id === id){
          const data = {
            title,
            description,
            worker,
            date,
            status,
            priority,
            range,
            id,
          }
          this.editLocalStorage(data, currentId)
        }else{
          return items
        }
      })
    }
    this.emptySubmitionForm(inputTitle, inputDescription, inputWorker, inputPriority, inputEndDate, inputRange, inputRangeBox);
    
    if(document.querySelector(".updateList")){
      document.querySelector(".updateList").remove();
    }
    if(document.querySelector(".hidden")){
      document.querySelector(".hidden").remove()
    }
    submitButton.style.display = "block"
    itemList.innerHTML = ""
    this.fromSubmition(this.getDataFromLocalStorage())
  },
  editLocalStorage(data, id){
    let item = "";
      item = JSON.parse(localStorage.getItem("inputData"))
      item[id] = data;
      localStorage.setItem("inputData", JSON.stringify(item))
  },
  deleteItemFromLocalStorage(id){
    const items = JSON.parse(localStorage.getItem('inputData'))
    const result = items.filter((productItem) => {
        return productItem.id !== id
    });
    localStorage.setItem('inputData',JSON.stringify(result))
    if(result.length ===0) location.reload();
  },
  taskDeleted(){
    const {itemList, showTotalItem} = this.loadSelector();
    itemList.addEventListener("click", (e)=>{
      const target = e.target;
      let list = +showTotalItem.textContent;
      if(target.className === "far fa-trash-alt taskDelete"){
        const item = target.parentElement.parentElement.parentElement.parentElement
        item.remove();
        list--;
        showTotalItem.textContent = list;
        this.addToCompletedTask();
        const del = +target.parentElement.parentElement.parentElement.id
        this.deleteItemFromLocalStorage(del);
        location.reload()
      }
    })
  },
  taskRejected(){
    const {itemList} = this.loadSelector();
    const getData = this.getDataFromLocalStorage()
    itemList.addEventListener("click", (e)=>{
      const target = e.target;
      const id = parseInt(target.id);
      if(target.className === "fas fa-power-off taskReject"){
        const item = target.parentElement.parentElement.children;
        for(let i = 0; i < item.length; i++){
            item[i].textContent = "rejected"
        }
        const data = {
          title: "rejected",
          description: "rejected",
          worker: "rejected",
          date: "rejected",
          status: "rejected",
          priority: "rejected",
          range: "0",
          id: id
        }
        this.showTotalLength()
        this.editLocalStorage(data, id)
        this.showNewAddedItem();
        itemList.innerHTML = "";
        this.fromSubmition(getData)
        location.reload()
      }
    })
  },
  addToCompletedTask(){
    const {itemList} = this.loadSelector();
    const getData = this.getDataFromLocalStorage()
    itemList.addEventListener("click", (e)=>{
      const target = e.target;
      const id = parseInt(target.id)
      if(target.className === "fas fa-check taskComplet"){
        const item = target.parentElement.parentElement.children;
        for(let i = 0; i < item.length; i++){
            item[i].textContent = "completed"
        }
        const data = {
          title: "completed",
          description: "completed",
          worker: "completed",
          date: "completed",
          status: "completed",
          priority: "completed",
          range: "100",
          id: id
        }
        this.editLocalStorage(data, id)
        this.showNewAddedItem()
        this.showTotalLength()
        itemList.innerHTML = "";
        this.fromSubmition(getData)
        location.reload()
      }
    })
  },
  showNewAddedItem(){
    const {showNewItem, showCompletedItem, showProgressItem} = this.loadSelector();
    const list = document.querySelectorAll(".showStatus")
    let item = 0;
    let progressItem = 0;
    let completedItem = 0;
    for(let i = 0; i < list.length; i++){
      let val = list[i].textContent.toLowerCase();
      if(val === "new"){
        item++;
        showNewItem.textContent = item
      }else if(val === "in progress"){
        progressItem++
        showProgressItem.textContent = progressItem;
      }else if(val === "completed"){
        completedItem++
        showCompletedItem.textContent = completedItem;
      }
    }
    return item;
  },
  chengingProgress(){
    const {showNewItem} = this.loadSelector();
    const list = document.querySelectorAll(".showStatus");
    const storage = this.getDataFromLocalStorage();
    for(let i = 0; i < list.length; i++){
      let item = list[i].textContent.toLowerCase();
      if(item === "new"){
        setTimeout(()=>{
          list[i].textContent = "In progress";
          showNewItem.textContent = 0
          this.showNewAddedItem()
        },30000)
      }
    }

    if(storage.length > 0){
      const ids = this.getDataFromLocalStorage().length - 1 ;
      const title = storage[ids].title;
      const description = storage[ids].description;
      const worker = storage[ids].worker;
      const date = storage[ids].date;
      const status = storage[ids].status = "In progress";
      const priority = storage[ids].priority;
      const range = storage[ids].range;
      const id = storage[ids].id;
      setTimeout(() => {
        const data = {
          title,
          description,
          worker,
          date,
          status,
          priority,
          range,
          id
        }
        this.editLocalStorage(data, ids)
      },30000)
      this.showNewAddedItem()
    }
  },
  showTotalLength(){
    const {showTotalItem, showProgressItem, showCompletedItem, showRejectedItem} = this.loadSelector()
    const totalLength = this.getDataFromLocalStorage()
    showTotalItem.innerHTML = totalLength.length;
    let progressNum = 0;
    let completeNum = 0;
    let rejectedNum = 0;
    totalLength.forEach(item =>{
      if(item.status === "in progress"){
        progressNum++
      }else if(item.status === "completed"){
        completeNum++;
      }else if(item.status === "rejected"){
        rejectedNum++
      }
    })
    showProgressItem.textContent = progressNum;
    showCompletedItem.textContent = completeNum;
    showRejectedItem.textContent = rejectedNum;
  },
  getInputEndDate(date){
    const dest = new Date(date).getTime()
      const now = new Date().getTime()
      const deff = dest - now
      const days = Math.floor(deff / (1000 * 60 * 60 * 24 ));
      const hours = Math.floor((deff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((deff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((deff % (1000 * 60)) / 1000);
      const formatedDay = this.formatedTime(days);
      const formatedHour = this.formatedTime(hours);
      const formatedMunites = this.formatedTime(minutes);
      const formatedSeconds = this.formatedTime(seconds);
      const getDate = `${formatedDay}d : ${formatedHour}h : ${formatedMunites}m : ${formatedSeconds}s`
      if(dest < now){
        return "oh no! it was gone"
      }else{
        return getDate
      }
  },
  formatedTime(time){
    return time < 10 ? (`0${time}`) : time;
  },
  getRangeBoxValue(){
    const {inputRange, inputRangeBox} = this.loadSelector();
    inputRangeBox.addEventListener("keyup", ()=>{
    inputRange.value = inputRangeBox.value
    })
  },
  getRangeValue(){
    const {inputRange, inputRangeBox} = this.loadSelector();
    inputRange.oninput = (()=>{
      let value = inputRange.value;
      inputRangeBox.value = value;
    })
    return inputRange.value;
  },
  setStatus(){
    const {inputStatus} = this.loadSelector();
    for(let i = 0; i < inputStatus.length; i++){
      if(inputStatus[i].checked){
        inputStatus[i].checked = false;
        return inputStatus[i].value;
      }
    }
  },
  setPrority(){
    const {inputPriority} = this.loadSelector();
    for(let i = 0; i < inputPriority.length; i++){
      if(inputPriority[i].checked){
        inputPriority[i].checked = "";
        return inputPriority[i].value
      }
    }
  },
  emptySubmitionForm(title, description, worker, priority, endDate, input, inputBox){
      title.value = "";
      description.value = "";
      worker.value = "";
      priority.checked = "";
      endDate.value = "";
      input.value = "";
      inputBox.value = "";
  },
  displayItem(result){
    const {itemList} = this.loadSelector();
    itemList.appendChild(result);
  },
  fromSubmition(data){
    const {itemList, fromViewer, resetBtn} = this.loadSelector()
      if(data.length === 0){
        fromViewer.style.display = "none"
        resetBtn.style.display = "none"
      }else{
        fromViewer.style.display = "block";
        resetBtn.style.display = "block";
        data.forEach(({title, id, description, worker, date, status, priority, range},index) => {
        const divWrapper = document.createElement("div");
        divWrapper.classList = "itemWrapper"
      const li = document.createElement("li");
        
        li.id = id;
        if(status === "completed"){
          li.classList = "item completedTask";
        }else if(status === "rejected"){
          li.classList = "item rejectedTask";
        }else{
          li.classList = "item";
        }
        divWrapper.appendChild(li);
      const divItem = document.createElement("div");
        divItem.classList = "divItem d-flex";
        li.appendChild(divItem);
      const showTitle = document.createElement("p");
        showTitle.classList = "showTitle";
        showTitle.id = description
        showTitle.textContent = title;
        divItem.appendChild(showTitle)
      const showPriority = document.createElement("p");
        showPriority.classList = "showPriority";
        showPriority.textContent = priority;
        divItem.appendChild(showPriority);
      const showStatus = document.createElement("p");
        showStatus.classList = "showStatus";
        showStatus.textContent = status
        divItem.appendChild(showStatus);
      const showDate = document.createElement("p");
        showDate.classList = "showDate";
         const formatedDate = ()=>{
          showDate.innerHTML = this.getInputEndDate(date)
        }
        setInterval(formatedDate,1000)
        showDate.id = date;
        divItem.appendChild(showDate);
      const showAssigned = document.createElement("p");
        showAssigned.classList = "showAssigned";
        showAssigned.id = id;
        showAssigned.textContent = worker;
        divItem.appendChild(showAssigned);
      const showCompleted = document.createElement("p");
        showCompleted.classList = "showCompleted";
        showCompleted.textContent = `${range}`;
        divItem.appendChild(showCompleted);
      const showAction = document.createElement("p");
        showAction.classList = "showAction d-flex";
        divItem.appendChild(showAction);
      const editItem = document.createElement("button");
        editItem.classList = "fas fa-edit taskEdit";
        editItem.id = index
        showAction.appendChild(editItem);
      const completeItem = document.createElement("button");
        completeItem.classList = "fas fa-check taskComplet";
        completeItem.id = id;
        showAction.appendChild(completeItem);
      const rejectItem = document.createElement("button");
        rejectItem.classList = "fas fa-power-off taskReject"
        rejectItem.id = id;
        showAction.appendChild(rejectItem);
      const deletetem = document.createElement("button");
        deletetem.classList = "far fa-trash-alt taskDelete";
        showAction.appendChild(deletetem);
        if(status === "completed"){
          showAction.innerHTML = "Completed"
        }else if(status === "rejected"){
          showAction.innerHTML = "Rejected";
        }else{
          li.classList = "item";
        }
      itemList.appendChild(divWrapper) 
      });
      
    }
  },
  saveDataToLocalStorage(data){
    let item = "";
    if(localStorage.getItem("inputData") === null){
      item = [];
      item.push(data)
      localStorage.setItem("inputData", JSON.stringify(item))
    }else{
      item = JSON.parse(localStorage.getItem("inputData"))
      item.push(data);
      localStorage.setItem("inputData", JSON.stringify(item))
    }
  },
  getDataFromLocalStorage(){
    let item = "";
    if(localStorage.getItem("inputData") === null){
      item = [];
    }else{
      item = JSON.parse(localStorage.getItem("inputData"))
    }
    return item;
  },
  getInputFromTheUser(){
    const{inputTitle, inputDescription, inputWorker, inputEndDate} = this.loadSelector();
    const title = inputTitle.value;
    const description = inputDescription.value;
    const worker = inputWorker.value;
    const date = inputEndDate.value;
    const status = this.setStatus();
    const priority = this.setPrority();
    const range = this.getRangeValue();
    if(status === "completed"){
      return {
        title: "completed",
        description: "completed",
        worker: "completed",
        date: "completed",
        status: "completed",
        priority: "completed",
        range: "100"
      }
    }else if(range === "100"){
      return {
        title: "completed",
        description: "completed",
        worker: "completed",
        date: "completed",
        status: "completed",
        priority: "completed",
        range: "100"
      }
    }else{
      return {
        title,
        description,
        worker,
        date,
        status,
        priority,
        range
      }
    }
  },
  getDataFromInput(){
    const getInput = this.getInputFromTheUser()
    const{inputTitle, inputDescription, inputWorker, inputEndDate, inputPriority, inputRange, inputRangeBox, itemList} = this.loadSelector();
    const title = getInput.title;
    const description = getInput.description;
    const worker = getInput.worker;
    const date = getInput.date;
    const status = getInput.status;
    const priority = getInput.priority;
    const range = getInput.range;
    const listItem = this.getDataFromLocalStorage();
    let id;
    if(listItem.length === 0){
      id = 0;
    }else{
      id = listItem[listItem.length - 1 ].id + 1;
    }
    if(title === "" || description === "" || worker === "" || date === "" || priority === undefined || status === undefined || range === ""){
      alert("Please check you are missing something")
    }else{
        const data = {
          title,
          description,
          worker,
          date,
          status,
          priority,
          range,
          id
        }
        this.emptySubmitionForm(inputTitle, inputDescription, inputWorker, inputPriority, inputEndDate, inputRange, inputRangeBox);
        this.saveDataToLocalStorage(data);
        itemList.innerHTML = ""
        this.fromSubmition(this.getDataFromLocalStorage())
    }
  },
  modifyOrUpdateProduct(e){
    if(e.target.classList.contains("submit")){
      this.getDataFromInput();
    }else if(e.target.classList.contains("updateList")){
      this.updateTheList(e)
    }
  },
  init(){
    const {submitOrUpdateButton} = this.loadSelector();
    submitOrUpdateButton.addEventListener("click", (e)=>{
      e.preventDefault();
      this.modifyOrUpdateProduct(e);
      this.showTotalLength();
      this.chengingProgress();
    })
    this.getRangeBoxValue();
    this.getRangeValue();
    this.showTotalLength();
    this.showNewAddedItem();
    this.chengingProgress();
    this.addToCompletedTask();
    this.taskRejected();
    this.taskDeleted();
    this.editTheItem();
    this.resetAllThis()
  }
}
UI.init();
window.addEventListener("DOMContentLoaded", ()=>{
  const inputData = UI.getDataFromLocalStorage();
  UI.fromSubmition(inputData)
})

























