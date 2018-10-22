function insertAfter(newNode, referenceNode) {
  if(referenceNode.nextElementSibling) {
    return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextElementSibling);
  } else {
    return referenceNode.parentNode.appendChild(newNode);
  }
}
function insertBefore(newNode, referenceNode) {
  return referenceNode.parentNode.insertBefore(newNode, referenceNode);  
}
function getRelativeOffset(screenPosition, elementRect) {
  return {
    'top':  screenPosition.clientY - elementRect.top,
    'left': screenPosition.clientX - elementRect.left
  }
}
function getRealtiveChildPosition(parent, child) {
  Array.prototype.indexOf.call(parent.children, child);
}
function removeShadow(parentNode) {
  for(trash of parentNode.getElementsByClassName('shadow')){
    trash.remove();
  }
}

function dropHandler(event) {
  const draggedElement = document.getElementById(event.dataTransfer.getData('id'));
  const dropBounding = this.getBoundingClientRect();
  let hoverOffsetBounding = getRelativeOffset(event, dropBounding);

  if(hoverOffsetBounding.top < dropBounding.height / 2) {
    insertBefore(draggedElement, this);
  } else {
    insertAfter(draggedElement, this);
  }
  console.log('drop', event);
}
document.addEventListener('DOMContentLoaded', function(...arg) {
  const boxes = document.getElementsByClassName('box');
  // see https://stackoverflow.com/q/11927309/3034747
  let draggedId = '';
  for(box of boxes) {
    box.addEventListener('dragstart', function(event) {
      event.dataTransfer.effectAllowed = "all";
      console.log('id', this.id)
      event.dataTransfer.setData('id', this.id);
      event.dataTransfer.setData('text', this.id);
      draggedId = this.id;
      console.log('dragstart', event, this);
    })
    box.addEventListener('dragend', function(event) {
      event.preventDefault();
      removeShadow(event.target.parentNode);
    })
    box.addEventListener('dragenter', function(event) {
      event.preventDefault();
      console.log('dragenter', event, this);
    })
    box.addEventListener('dragleave', function(event) {
      event.preventDefault();
      console.log('dragleave', event, this);
    })
    box.addEventListener('dragover', function(event) {
      // Agar Mentrigger Drop event
      event.preventDefault()
      // see https://stackoverflow.com/q/11927309/3034747
      const draggedElement = document.getElementById(draggedId);
      const dropBounding = this.getBoundingClientRect();
      let hoverOffsetBounding = getRelativeOffset(event, dropBounding);

      const shadow = document.createElement(draggedElement.tagName);
      shadow.className = 'shadow';
      shadow.addEventListener('drop', dropHandler);
      if(hoverOffsetBounding.top < dropBounding.height / 2) {
        if(!this.previousElementSibling || this.previousElementSibling.className != 'shadow') {
          removeShadow(this.parentNode);
          insertBefore(shadow, this);
        }
      } else {
        if(!this.nextElementSibling || this.nextElementSibling.className != 'shadow') {
          removeShadow(this.parentNode);
          insertAfter(shadow, this);
        }
      }
      setTimeout(() => {
        shadow.style.height = dropBounding.height.toString() + 'px';
        shadow.style.width = dropBounding.width.toString() + 'px';
      }, 0);
    })
    box.addEventListener('drop', dropHandler);
    box.addEventListener('mouseenter', function(event) {
      event.preventDefault();
      const overlay = document.createElement('div');
      overlay.className = 'drag-overlay';
      this.appendChild(overlay);
    })
    box.addEventListener('mouseleave', function(event){
      event.preventDefault();
      const overlays = this.getElementsByClassName('drag-overlay');
      for(overlay of overlays) {
        overlay.remove();
      }
    })
    // box.addEventListener('dblclick', function(...event) {
    //   this.style.cursor = 'default';
    // })
  }
})
