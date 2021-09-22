import React from 'react';
import Box from '@material-ui/core/Box';
import { ColumnDirective, ColumnsDirective, TreeGridComponent } from '@syncfusion/ej2-react-treegrid';
import { ContextMenu, Filter, Inject, Sort, Edit, Freeze, Reorder, Resize, RowDD } from '@syncfusion/ej2-react-treegrid';
import { source } from '../src/data';

export default function Index() {

  const columns = [
    {
      field: 'TaskID',
      headerText: 'Task ID',
      width: '80',
    },
    {
      field: 'TaskName',
      headerText: 'Task Name',
      width: '120',
    },
    {
      field: 'StartDate',
      headerText: 'Start Date',
      width: '90',
    },
    {
      field: 'EndDate',
      headerText: 'End Date',
      width: '90',
    },
    {
      field: 'Duration',
      headerText: 'Duration',
      width: '90',
    },
    {
      field: 'Progress',
      headerText: 'Progress',
      width: '90',
    },
  ];

  let colIndex = 0;

  const [treegrid, setTreegrid] = React.useState(null);
  const [isFilter, setIsFilter] = React.useState(false);
  const [isMultiSort, setIsMultiSort] = React.useState(false);
  const [isFreeze, setIsFreeze] = React.useState(false);
  const [frozenCount, setFrozenCount] = React.useState(0);
  const [isMultiSelect, setIsMultiSelect] = React.useState(false);

  const [customCss, setCustomCss] = React.useState([...Array(columns.length)].map(val => new Object({
    textAlign: 'right',
    color: 'black',
    fontSize: 'small',
  })));

  const [selectedRows, setSelectedRows] = React.useState([]);
  const [selectedRecords, setSelectedRecords] = React.useState([]);
  const [pasteType, seetPasteType] = React.useState('');

  const editSettings = {
    allowAdding: true,
    allowDeleting: true,
    allowEditing: true,
    mode: 'Dialog',
    newRowPosition: 'Child',
  };

  const filterOptions = {
    type: 'Menu',
  };

  const singleSelectionSettings = {
    type: 'Single',
  };

  const multipleSelectionSettings = {
    type: 'Multiple',
  };

  const contextMenuItems = [
    'AddRow',
    'Edit', 
    'Delete',
    { 
      text: 'Style', 
      target: '.e-headercontent',
      items: [
        { 
          text: 'Font',
          items: [
            { 
              text: 'Small',
              id: 'small',
            },
            { 
              text: 'Medium',
              id: 'medium',
            },
            { 
              text: 'Large',
              id: 'large',
            },
          ],
        },
        { 
          text: 'Color',
          items: [
            { 
              text: 'Black',
              id: 'black',
            },
            { 
              text: 'Red',
              id: 'red',
            },
            {
              text: 'Green',
              id: 'green',
            },
            { 
              text: 'Blue',
              id: 'blue',
            },
          ],
        },
        { 
          text: 'Alignment',
          items: [
            { 
              text: 'Left',
              id: 'left',
            },
            { 
              text: 'Center',
              id: 'center',
            },
            { 
              text: 'Right',
              id: 'right',
            },
          ],
        },
      ],
    },
    { text: 'Freeze: '.concat(isFreeze ? 'ON' : 'OFF'), target: '.e-headercontent', id: 'freeze' },
    { text: 'Filter: '.concat(isFilter ? 'ON' : 'OFF'), target: '.e-headercontent', id: 'filter' },
    { text: 'Multi-Sort: '.concat(isMultiSort ? 'ON' : 'OFF'), target: '.e-headercontent', id: 'msort' },
    { text: 'Multi-Select: '.concat(isMultiSelect ? 'ON' : 'OFF'), target: '.e-content', id: 'mselect' },
    { text: 'Copy', target: '.e-content', id: 'copy' },
    { text: 'Cut', target: '.e-content', id: 'cut' },
    { text: 'Paste as Sibling', target: '.e-content', id: 'pasteassibling' },
    { text: 'Paste as Child', target: '.e-content', id: 'pasteaschild' },
  ];

  const contextMenuClick = (args) => {
    if (treegrid) {
      const id = args.item.id;
      if(id == 'freeze') {
        setFrozenCount(colIndex);
        if(colIndex > 0) setIsFreeze(!isFreeze);
      }
      if(id == 'filter') {
        setIsFilter(!isFilter);
      }
      if(id == 'msort') {
        setIsMultiSort(!isMultiSort);
      }
      if(id == 'mselect') {
        setIsMultiSelect(!isMultiSelect);
      }
      if(id == 'left' || id == 'center' || id == 'right') {
        setCustomCss(customCss.map((val, index) => index === colIndex ? { ...val, textAlign: id } : val));
      }
      if(id == 'small' || id == 'medium' || id == 'large') {
        setCustomCss(customCss.map((val, index) => index === colIndex ? { ...val, fontSize: id } : val));
      }
      if(id == 'black' || id == 'red' || id == 'green' || id == 'blue') {
        setCustomCss(customCss.map((val, index) => index === colIndex ? { ...val, color: id } : val));
      }
      if(id == 'copy' || id == 'cut') {
        selectedRows.map(val => {
          val.style.backgroundColor = '';
        })
        treegrid.getSelectedRows().map(val => {
          val.style.backgroundColor = 'wheat';
        })
        setSelectedRows(treegrid.getSelectedRows());
        setSelectedRecords(treegrid.getSelectedRecords());
        seetPasteType(id);
      }
      if(id == 'pasteassibling' || id == 'pasteaschild') {
        if(pasteType === 'cut' || pasteType === 'copy') {
          let data = treegrid.dataSource.map(val => val);
          const childs = getChilds(data, selectedRecords);
          let realRecords = selectedRecords.filter(val => !childs.map(value => value['TaskID']).includes(val['TaskID'])).map(val => val['taskData']);
          if(pasteType === 'cut') data = data.filter(val => !realRecords.map(value => value['TaskID']).includes(val['TaskID']));
          const onRecord = treegrid.getSelectedRecords()[0];
          if(childs.map(val => val['TaskID']).includes(onRecord['TaskID'])) {
            alert('Selected error! There is a parent of selected record in the copy records.');
          } else {
            if(id == 'pasteassibling')
              onRecord['parentID'] ? realRecords.forEach(val => val['parentID'] = onRecord['parentID']) : realRecords.forEach(val => delete val['parentID']);
            else
              realRecords.forEach(val => val['parentID'] = onRecord['TaskID']);
            if(pasteType === 'copy') {
              const maxID = Math.max(...data.map(val => val['TaskID']));
              realRecords = realRecords.concat(getChilds(data, realRecords));
              realRecords = setNewIds(realRecords.map(val => val), maxID + 1);
            }
            let index = 0;
            data.forEach((val, i) => {
              if(val['TaskID'] === onRecord['TaskID']) index = i;
            });
            data.splice(index + 1, 0, ...realRecords);
            treegrid.dataSource = data;
            selectedRows.map(val => {
              val.style.backgroundColor = '';
            })
            seetPasteType('');
          }
        } else {
          alert('Please select records to copy.');
        }
      }
    }
  }

  const getChilds = (data, records) => {
    if(records.length === 0) return [];
    const result = data.filter(val => records.map(value => value['TaskID']).includes(val['parentID']));
    return result.concat(getChilds(data, result));
  }

  const setNewIds = (records, newID) => {
    let newIDs = {};
    let result = records.map((val, index) => {
      newIDs[val['TaskID']] = newID + index;
      return { ...val, TaskID: newID + index };
    })
    result.forEach(val => {
      if(val['parentID'] !== undefined) {
        Object.keys(newIDs).forEach(value => {
          if(Number(value) === val['parentID'])
            val['parentID'] = newIDs[value];
        })
      }
    })
    return result;
  }

  const contextMenuOpen = (args) => {
    const el = args.event.target.closest('.e-headercell');
    if(el) {
      colIndex = Number(el.ariaColIndex);
    }
  }

  const runCustomCss = () => {
    for(let i=0; i < columns.length; i++) {
      const elements = document.querySelectorAll(`[aria-colindex='${i}']`);
      elements.forEach((val, index) => {
        if(index === 0) {
          val.firstChild.style.textAlign = customCss[i].textAlign;
          val.firstChild.style.fontSize = customCss[i].fontSize;
          val.firstChild.style.color = customCss[i].color;
        }
        else {
          val.style.textAlign = customCss[i].textAlign;
          val.style.fontSize = customCss[i].fontSize;
          val.style.color = customCss[i].color;
        }
      })
    }
  }

  const actionComplete = (args) => {
    if(args.requestType = 'reorder' && args.fromIndex !== undefined) {
      const result = customCss;
      result.splice(args.fromIndex, 0, result.splice(args.toIndex, 1)[0]);
      setCustomCss(result);
    }
    runCustomCss();
  }

  React.useEffect(() => {
    runCustomCss();
  }, [ customCss ])

  return (
    <Box m={4}>
      <TreeGridComponent 
        dataSource={source}
        treeColumnIndex={1}
        idMapping='TaskID'
        parentIdMapping='parentID'
        allowSorting={true}
        allowReordering={true}
        allowResizing={true}
        allowRowDragAndDrop={true}
        allowFiltering={isFilter}
        filterSettings={filterOptions}
        editSettings={editSettings}
        selectionSettings={isMultiSelect ? multipleSelectionSettings : singleSelectionSettings}
        frozenColumns={isFreeze ? frozenCount : 0}
        contextMenuItems={contextMenuItems}
        contextMenuClick={contextMenuClick}
        contextMenuOpen={contextMenuOpen}
        actionComplete={actionComplete}
        ref={grid => setTreegrid(grid)}
      >
        <ColumnsDirective>
          {columns.map((val, index) => (
            <ColumnDirective 
              key={index}
              field={val.field} 
              headerText={val.headerText} 
              width={val.width}
              format={val.headerText.includes('Date') ? 'y-MM-dd' : null}
              textAlign='right'
            />
          ))}
        </ColumnsDirective>
        <Inject services={[Filter, Freeze, Sort, Edit, Reorder, Resize, ContextMenu, RowDD]}/>
      </TreeGridComponent>
    </Box>
  );
}
