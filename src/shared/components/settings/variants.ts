const variantsSettings = {
    open: {
        y: 0,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        }
    },
    closed: {
        y: -50,
        transition: {
            y: { stiffness: 1000 }
        }
    }
};

const variantsSettingsContent = {
    open: {
        width: '20vw',
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        }
    },
    closed: {
        width: 0,
        transition: {
            y: { stiffness: 1000 },
            delay: 1
        }
    }
}

const variantsSettingsContentMobile = {
    open: {
        width: '80vw',
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        }
    },
    closed: {
        width: 0,
        transition: {
            y: { stiffness: 1000 },
            delay: 1
        }
    }
}

const variantsSettingsBg = {
    open: {
        opacity: 1,
        transition: {
            y: { stiffness: 1000, velocity: -100 },
        }
    },
    closed: {
        opacity: 0,
        transition: {
            y: { stiffness: 1000 }
        }
    }
}

export { variantsSettings, variantsSettingsContent, variantsSettingsBg, variantsSettingsContentMobile }