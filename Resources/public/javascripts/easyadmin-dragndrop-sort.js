var easyadminDragndropSort =
    {
        initDraggableEntityRows: function() {

            function hasClass(ele,cls) {
                return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
            }

            var table;
            var tbody;

            var body = document.getElementsbyTagName("body")[0];
            if(hasClass(body, "easyadmin-list-Page")){

                var content = body.getElementById("main")
                if(hasClass(content, "content")){

                    table = content.getElementsByClassName("table")[0];
                    tbody = content.getElementsByClassName("table")[0];

                    var tableRows = table.getElementsByTagName("tr");

                    for (row in tableRows) {
                        row.setAttribute('draggable', true);
                    }
                };
            };

            var dragSrcEl = null; // the object being drug
            var startPosition = null; // the index of the row element (0 through whatever)
            var endPosition = null; // the index of the row element being dropped on (0 through whatever)
            var parent; // the parent element of the dragged item
            var entityId; // the id (key) of the entity

            function handleDragStart(e) {
                dragSrcEl = e.currentTarget;
                entityId = dragSrcEl.getAttribute('data-id');
                dragSrcEl.style.opacity = '0.4';
                parent = dragSrcEl.parentNode;
                startPosition = Array.prototype.indexOf.call(parent.children, dragSrcEl);
                console.log("start: "+startPosition);
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
                if (dragSrcEl != this) {
                    endPosition = Array.prototype.indexOf.call(parent.children, this);
                    console.log("end: "+endPosition);
                    // Set the source column's HTML to the HTML of the column we dropped on.
                    dragSrcEl.innerHTML = this.innerHTML;
                    this.innerHTML = e.dataTransfer.getData('text/html');

                    // do the ajax call to update the database
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', (location.pathname+location.search).substr(1));
                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            var response = xhr.responseText;
                            var newBody = response.getElementsbyTagName("body")[0];
                            var newTbody = newBody.getElementsbyTagName("tbody")[0];
                            tbody.parentNode.replaceChild(newTbody, tbody);
                            easyadminDragndropSort.initDraggableEntityRows();
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
                [].forEach.call(rows, function (row) {
                    row.classList.remove('over');
                });
            }
            var rows = document.querySelectorAll('table.sortable > tbody tr');
            [].forEach.call(rows, function(row) {
                row.addEventListener('dragstart', handleDragStart, false);
                row.addEventListener('dragenter', handleDragEnter, false);
                row.addEventListener('dragover', handleDragOver, false);
                row.addEventListener('dragleave', handleDragLeave, false);
                row.addEventListener('drop', handleDrop, false);
                row.addEventListener('dragend', handleDragEnd, false);
            });
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
