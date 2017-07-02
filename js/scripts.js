'use strict';

jQuery(function ($, undefined) {
    const defaultFormData = {
        'sum': 1000,
        'term': 5,
        'ic': '3500094590',
        'surname': 'Petrov',
        'name': 'Ivan',
        'city': 'Kyiv'
    };
    const routes = {
        '/step1': ['templates/step1'],
        '/step2': ['templates/step2'],
        '/step3': ['templates/step3'],
        //'/step4': ['templates/step1', 'templates/step2'],
        // '/step5': ['templates/step1', 'templates/step2', 'templates/step3'],
    };
    const errorMessages = {
        'sum': 'The range is from 1 to 10000.',
        'term': 'The range is from 1 to 10000.',
        'ic1': 'Not valid identification code.',
        'ic2': 'Your age not 21.',
        'surname': 'Its required field.',
        'name': 'Its required field.',
        'city': 'Its required field.'
    };
    var currentPath = window.location.pathname;


    /* FIRST STEP - CREATE FORM TEMPLATE */

    /* Show form-step template */
    function showStep() {
        var resultStepHtml = '';
        var templateParts = getCurrentStepTemplates();

        function getCurrentStepTemplates() {
            var resPath = routes[currentPath];

            if (!resPath) {
                currentPath = '/step1';
            }

            resPath = routes[currentPath];
            return resPath;
        }

        (function createTemplate(routesArray) {
            $.get(routesArray[0] + '.html', function (data) {
                resultStepHtml += data;

                if (routesArray.length == 1) {
                    $("#test-form").html(resultStepHtml);
                    handleTemplate();
                }
                else {
                    routesArray.shift();
                    createTemplate(routesArray);
                }
            });
        })(templateParts);
    }

    /* Getter/setter for form data */
    function getDataOfSteps() {
        var dataOfSteps = Object();

        dataOfSteps.stepNumber = parseInt(currentPath.replace('/step', ''));
        dataOfSteps.countOfSteps = parseInt(Object.keys(routes).length);

        return dataOfSteps;
    }

    function getSessionStorageData() {
        return sessionStorage.getItem('formData');
    }

    function setSessionStorageData(jsonData) {
        sessionStorage.setItem('formData', jsonData);
    }

    /* Create navigation */
    function createProgressBar() {
        var dataOfSteps = getDataOfSteps();
        var progressBarHtml = '';
        var linkStep = '';

        for (var i = 1; i <= dataOfSteps.countOfSteps; i++) {
            i <= dataOfSteps.stepNumber ? linkStep = ' progress-active' : linkStep = '';
            progressBarHtml += '<a href="/step' + i + '" class="progress-bar-step progress-bar-' + i + linkStep + '" style="width:' + 100 / dataOfSteps.countOfSteps + '%;">' + i + '</a>';
        }

        $('.progress-bar').html(progressBarHtml);

        $(".progress-bar-step").on('click', function (e) {
            e.preventDefault();

            var thisBtn = $(this);

            if ($(this).attr('href') > currentPath) {
                var nextStepAbility = true;
                var inputsList = $('#test-form input[id]');
                inputsList.each(function (inputNumber) {
                    $(inputsList[inputNumber]).trigger("blur");
                });

                setTimeout(function () {
                    inputsList.each(function (inputNumber) {
                        if ($(inputsList[inputNumber]).data('valid') == false) {
                            nextStepAbility = false;
                        }
                    });

                    if (nextStepAbility) {
                        var currentData = getSessionStorageData();
                        var dataKey;
                        currentData = JSON.parse(currentData);

                        inputsList.each(function (inputNumber) {
                            dataKey = $(inputsList[inputNumber]).attr('id');
                            currentData[dataKey] = $(inputsList[inputNumber]).val();
                        });

                        setSessionStorageData(JSON.stringify(currentData));
                        window.location.href = $(thisBtn).attr('href');
                    }
                }, 500);
            }
            else {
                window.location.href = $(this).attr('href');
            }


            return false;
        });
    }

    function createNavButtons() {
        var dataOfSteps = getDataOfSteps();
        var progressNavHtml = '';

        switch (dataOfSteps.stepNumber) {
            case 1:
                progressNavHtml = '<a href="/step2" class="next btn btn-default pull-right">Вперед</a>';
                break;
            case dataOfSteps.countOfSteps:
                progressNavHtml = '<a href="/step' + (dataOfSteps.countOfSteps - 1) + '" class="prev btn btn-default pull-left">Назад</a>';
                break;
            default:
                progressNavHtml = '<a href="/step' + (dataOfSteps.stepNumber - 1) + '" class="prev btn btn-default pull-left">Назад</a>';
                progressNavHtml += '<a href="/step' + (dataOfSteps.stepNumber + 1) + '" class="next btn btn-default pull-right">Вперед</a>';
        }

        $(".switch-buttons").html(progressNavHtml);

        $(".next").on('click', function (e) {

            e.preventDefault();
            var nextStepAbility = true;
            var inputsList = $('#test-form input[id]');
            inputsList.each(function (inputNumber) {
                $(inputsList[inputNumber]).trigger("blur");
            });

            setTimeout(function () {
                inputsList.each(function (inputNumber) {
                    if ($(inputsList[inputNumber]).data('valid') == false) {
                        nextStepAbility = false;
                    }
                });

                if (nextStepAbility) {
                    var currentData = getSessionStorageData();
                    var dataKey;
                    currentData = JSON.parse(currentData);

                    inputsList.each(function (inputNumber) {
                        dataKey = $(inputsList[inputNumber]).attr('id');
                        currentData[dataKey] = $(inputsList[inputNumber]).val();
                    });

                    setSessionStorageData(JSON.stringify(currentData));
                    window.location.href = $('.next').attr('href');
                }
            }, 500);

            return false;
        });
    }


    /* SECOND STEP - HANDLING FORM TEMPLATE */

    /* Add initial data to form inputs */
    function autoFill() {
        //get form inputs id's
        var formInputs = $('#test-form input[id]');
        var formInputsIds = formInputs.map(function () {
            return this.id;
        }).get();

        var formData = getSessionStorageData();

        if (formData) {
            formData = JSON.parse(formData);
        }
        else {
            setSessionStorageData(JSON.stringify(defaultFormData));
            formData = defaultFormData;
        }

        $.each(formInputsIds, function (inputId) {
            var id = formInputsIds[inputId];
            $('#' + id).val(formData[id]);
        });
    }

    /* Add onblur validation event to inputs */
    function addBlurEvent() {
        $('#test-form input[id]').on('blur', function (event) {
            inputValidation(event.target.id);
        });

        function inputValidation(id) {
            var input = $('#' + id);
            var inputValue = input.val();

            function insertSuccessMark() {
                if (input.parent().find('.error').length) {
                    input.parent().find('.error').remove();
                    $(input).before('<span class="success-mark">&#10004;</span>');
                }
                else if (!input.parent().find('.success-mark').length) {
                    $(input).before('<span class="success-mark">&#10004;</span>');
                }

                input.data('valid', true);
            }

            function insertErrorMessage(errorText) {
                if (input.parent().find('.success-mark').length) {
                    input.parent().find('.success-mark').remove();
                    $(input).before('<span class="error error-mark">&#10008;</span>');
                    input.parent().find('input').before('<p class="error error-text">' + errorText + '</p>');
                }
                else if (!input.parent().find('.error-mark').length) {
                    $(input).before('<span class="error error-mark">&#10008;</span>');
                    input.parent().find('input').before('<p class="error error-text">' + errorText + '</p>');
                }

                input.data('valid', false);
            }

            $.post("/php/validation.php", {'id': id, 'value': inputValue}, function (data) {
                if (data == 1) {
                    insertSuccessMark();
                }
                else {
                    data = JSON.parse(data);
                    insertErrorMessage(errorMessages[data.errorMsgId]);
                }
            });

        }
    }

    /* View result data and submitting it */
    function viewResult() {
        var resultData = JSON.parse(getSessionStorageData());
        var resultHtml = '';
        for (var inputName in resultData) {
            resultHtml += '<tr><td>' + inputName + '</td><td>' + resultData[inputName] + '</td></tr>';
        }
        $('.table-data').html(resultHtml);
        $('.submit').on('click', function () {
            event.preventDefault();

            $.post("/php/submit.php", getSessionStorageData(), function (data) {
                if (data) {
                    alert('Data submitted ;)');
                    sessionStorage.clear();
                    window.location.href = '/step1';
                }
            });

            return false;
        });
    }

    function handleTemplate() {
        if (currentPath != Object.keys(routes)[Object.keys(routes).length - 1]) {
            autoFill();
            addBlurEvent();
        }
        else {
            viewResult();
        }
    }


    /* INITIALIZE APP */

    (function initApp() {
        showStep();
        createProgressBar();
        createNavButtons();
    })();
});