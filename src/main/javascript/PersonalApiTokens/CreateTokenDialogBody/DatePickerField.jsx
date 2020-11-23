import React, {useRef, useState} from 'react';
import {InputAdornment, Popover, TextField} from '@material-ui/core/index';
import styles from './CreateTokenDialogBody.scss';
import {Button, Calendar, Close} from '@jahia/moonstone';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import {DatePicker} from '@jahia/moonstone-alpha';
import PropTypes from 'prop-types';

dayjs.extend(LocalizedFormat);

export const DatePickerField = ({selectedDateTime, onSelectDateTime}) => {
    const [isShowPicker, setShowPicker] = useState(false);
    const calendarField = useRef();

    return (
        <>
            <TextField
                disabled
                inputRef={calendarField}
                value={selectedDateTime ? selectedDateTime.format('LLL') : ''}
                InputProps={{
                    disableUnderline: true,
                    classes: {root: styles.inputStyle, error: styles.inputError, focused: styles.inputFocus, input: styles.text},
                    startAdornment: (
                        <InputAdornment position="end">
                            <Button variant="ghost" icon={<Calendar/>} onClick={() => setShowPicker(true)}/>
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <Button variant="ghost" icon={<Close/>} onClick={() => onSelectDateTime(null)}/>
                        </InputAdornment>
                    )
                }}
                onChange={e => onSelectDateTime(dayjs(e.target.value))}
            />
            <Popover
                open={isShowPicker}
                anchorEl={calendarField.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
                onClose={() => setShowPicker(false)}
            >
                <DatePicker lang="en"
                            variant="datetime"
                            selectedDateTime={selectedDateTime?.toDate()}
                            onSelectDateTime={date => {
                                onSelectDateTime(dayjs(date));
                            }}
                />
            </Popover>
        </>
    );
};

DatePickerField.propTypes = {
    selectedDateTime: PropTypes.object.isRequired,
    onSelectDateTime: PropTypes.func.isRequired
};
