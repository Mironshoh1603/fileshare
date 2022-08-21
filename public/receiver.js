(function () {
  let senderId;
  let clientSocket = io();
  function generateID() {
    return `${Math.trunc(Math.random() * 999)}-${Math.trunc(
      Math.random() * 999
    )}-${Math.trunc(Math.random() * 999)}`;
  }
  document
    .querySelector("#receiver-start-con-btn")
    .addEventListener("click", function () {
      senderId = document.querySelector("#join-id").value;
      if (senderId.length == 0) {
        return;
      }
      let joinID = generateID();
      clientSocket.emit("reciever-join", {
        uid: joinID,
        sender_uid: senderId,
      });
      document.querySelector(".join-screen").classList.remove("active");
      document.querySelector(".fs-screen").classList.add("active");
    });
  let fileShare = {};
  clientSocket.on("fs-meta", function (metadata) {
    fileShare.metadata = metadata;
    fileShare.transmitted = 0;
    fileShare.buffer = [];
    let el = document.createElement("div");
    el.classList.add("item");
    el.innerHTML = `
      <div class="progress" >0%</div>
      <div class="filename">${metadata.filename}</div>
        `;
    document.querySelector(".files-list").appendChild(el);
    fileShare.progress_node = el.querySelector(".progress");
    clientSocket.emit("fs-start", {
      uid: senderId,
    });
  });
  clientSocket.on("fs-share", function (buffer) {
    fileShare.buffer.push(buffer);
    fileShare.transmitted += buffer.byteLength;
    fileShare.progress_node.innerText = Math.trunc(
      (fileShare.transmitted / fileShare.metadata.total_buffer_size) * 100 + "%"
    );
    console.log("Keldi");
    if (fileShare.transmitted == fileShare.metadata.total_buffer_size) {
      download(new Blob(fileShare.buffer), fileShare.metadata.filename);
      fileShare = {};
      console.log("ifni icchi");
    } else {
      console.log("else icchi");

      clientSocket.emit("fs-start", {
        uid: senderId,
      });
    }
  });
})();
