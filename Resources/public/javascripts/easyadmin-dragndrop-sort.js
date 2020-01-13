
let easyadminDragndropSort =
    {
        initDraggableEntityRows: function() {

            if(document.body.classList.contains('easyadmin') && document.body.classList.contains('list')) {

                if (!Array.prototype.last){
                    Array.prototype.last = function(){
                        return this[this.length - 1];
                    };
                }

                let entityClass = "App\\Entity\\"+document.body.id.split('-').last();
                let content = document.getElementById("main");
                let table = content.getElementsByClassName("table")[0];
                let tbody = table.getElementsByTagName("tbody")[0];
                let tableRows = tbody.getElementsByTagName("tr");
                let dragSrcEl = null; // the object being drug
                let startPosition = null; // the index of the row element (0 through whatever)
                let endPosition = null; // the index of the row element being dropped on (0 through whatever)
                let parent; // the parent element of the dragged item
                let entityId; // the id (key) of the entity
                let parser = new DOMParser();

                for (let row in tableRows) {
                    if (tableRows.hasOwnProperty(row)) {
                        tableRows[row].setAttribute("draggable", "true");

                    }
                }

                function handleDragStart(e) {
                    dragSrcEl = e.currentTarget;
                    console.log(dragSrcEl);
                    entityId = dragSrcEl.getAttribute('data-id');
                    dragSrcEl.style.opacity = '0.1';
                    parent = dragSrcEl.parentNode;
                    startPosition = Array.prototype.indexOf.call(parent.children, dragSrcEl);
                    console.log("start: " + startPosition);
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/html', this.innerHTML);
                    console.log(entityId);
                }

                function handleDragOver(e) {
                    //console.log('drag over: '+ e.target);
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

                    return false;
                }

                function handleDragEnter(e) {
                    //console.log('drag enter: '+ e.target);
                    this.classList.add('over');
                }

                function handleDragLeave(e) {
                    //console.log('drag leave: '+ e.target);
                    this.classList.remove('over');  // this / e.target is previous target element.
                }

                function handleDrop(e) {
                    //console.log('drop: '+ e.target);
                    //console.log(e.currentTarget);
                    //console.log(dragSrcEl);

                    if (e.stopPropagation) {
                        e.stopPropagation(); // stops the browser from redirecting.
                    }

                    // Don't do anything if dropping the same column we're dragging.
                    if (dragSrcEl !== this) {
                        endPosition = Array.prototype.indexOf.call(parent.children, this);
                        console.log("end: " + endPosition);
                        // Set the source column's HTML to the HTML of the column we dropped on.
                        dragSrcEl.innerHTML = this.innerHTML;
                        this.innerHTML = e.dataTransfer.getData('text/html');

                        // do the ajax call to update the database
                        let xhr = new XMLHttpRequest();
                        //xhr.open('GET', (location.pathname + location.search));

                        xhr.open('GET', (encodeURI('/manage/sort/' + entityClass + '/' + entityId + '/' + endPosition)));

                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                let response = parser.parseFromString(xhr.responseText,"text/html");
                                let newBody = response.getElementsByTagName("body")[0];
                                let newTbody = newBody.getElementsByTagName("tbody")[0];
                                tbody.parentNode.replaceChild(newTbody, tbody);
                                easyadminDragndropSort.initDraggableEntityRows();

                                $('input[data-toggle="toggle"]').bootstrapToggle();
                            }
                            else {
                                alert("An error occurred while sorting. Please refresh the page and try again.")
                            }
                        };
                        xhr.send();
                    }
                    return false;
                }

                function handleDragEnd(e) {
                    //console.log('drag end: '+ e.target);
                    this.style.opacity = '1';  // this / e.target is the source node.
                    [].forEach.call(tableRows, function (row) {
                        row.classList.remove('over');
                    });
                }

                [].forEach.call(tableRows, function (row) {
                    row.addEventListener('dragstart', handleDragStart, false);
                    row.addEventListener('dragenter', handleDragEnter, false);
                    row.addEventListener('dragover', handleDragOver, false);
                    row.addEventListener('dragleave', handleDragLeave, false);
                    row.addEventListener('drop', handleDrop, false);
                    row.addEventListener('dragend', handleDragEnd, false);
                });
            }
        },

        /**
         * Primary Admin initialization method.
         * @returns {boolean}
         */
        init: function() {
            this.initDraggableEntityRows();
            return true;
        }
    };

document.addEventListener("DOMContentLoaded", function(event) {
    easyadminDragndropSort.init();
});
