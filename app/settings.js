let enableExtension = false;
let unwantedLanguage = "";
let preferredLanguage = "";

$(document).ready(function () {
    chrome.storage.sync.get('enableExtension', (data) => {
        enableExtension = data.enableExtension;
    
        chrome.storage.sync.get('unwantedLanguage', (data) => {
            unwantedLanguage = data.unwantedLanguage;

            chrome.storage.sync.get('preferredLanguage', (data) => {
                preferredLanguage = data.preferredLanguage;

                $("#enableExtensionCheckbox").prop("checked", enableExtension == true);
                $("#unwantedLanguagePicker").val(unwantedLanguage);
                $("#preferredLanguagePicker").val(preferredLanguage);

                updateFormEnabled($("#enableExtensionCheckbox")[0].checked);

                // Handle enable/disable checkbox
                $('#enableExtensionCheckbox').on('change', function (e) {
                    var enabled = $("#enableExtensionCheckbox")[0].checked;

                    updateFormEnabled(enabled);
                });

                // Handle save button click
                $("#saveButton").click(function () {
                    try {
                        var enabled = $("#enableExtensionCheckbox")[0].checked;
                        var unwanted = $('#unwantedLanguagePicker').val();
                        var preferred = $('#preferredLanguagePicker').val();

                        if (unwanted === "" || preferred === "") {
                            $("#success-warning").fadeTo(2000, 500).slideUp(500, function () {
                                $("#success-warning").slideUp(500);
                            });
                            
                            return;
                        }

                        chrome.storage.sync.set({'enableExtension': enabled});
                        chrome.storage.sync.set({'unwantedLanguage': unwanted});
                        chrome.storage.sync.set({'preferredLanguage': preferred});

                        $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
                            $("#success-alert").slideUp(500);
                        });
                    }
                    catch (exception)
                    {
                        $("#success-error").fadeTo(2000, 500).slideUp(500, function () {
                            $("#success-error").slideUp(500);
                        });
                    }
                });

                // Handle Open Settings on popup page
                $("#openSettingsLink").click(function () {
                    if (chrome.runtime.openOptionsPage) {
                        chrome.runtime.openOptionsPage();
                    } else {
                        chrome.tabs.create({
                            url: chrome.runtime.getURL('app/settings.html')
                        });
                    }
                });

                var urlParams = new URLSearchParams(location.search);

                if (urlParams.has("firstTime")) {
                    AnnoButton.prototype.buttonElem = function (anno) {
                        return $("<button class='anno-btn'></button>").html(this.textFn(anno)).addClass(this.className).click((function (_this) {
                            return function (evt) {
                                evt.preventDefault(); //<--Stop event from bubbling up to elements it shouldn't be fiddling with
                                return _this.click.call(anno, anno, evt);
                            };
                        })(this));
                    };

                    var anno1 = new Anno([{
                        target: '#unwantedLanguagePicker',
                        content: 'Enter the <strong>unwanted</strong> language here, i.e.: nl-nl',
                        position: 'top'
                    },
                    {
                        target: '#preferredLanguagePicker',
                        content: 'Enter the <strong>preferred</strong> language here, i.e.: en-us',
                        position: 'top'
                    },
                    {
                        target: '#saveButton',
                        content: 'Click save to persist the new settings',
                        position: 'bottom'
                    }]);

                    anno1.show();
                }
            });
        }); 
    });
});

function updateFormEnabled(enabled) {
    $("#preferredLanguagePicker").prop('disabled', !enabled);
    $("#unwantedLanguagePicker").prop('disabled', !enabled);
}