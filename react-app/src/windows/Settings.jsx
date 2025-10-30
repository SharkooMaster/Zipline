import { useEffect, useState, useMemo } from "react";
import yaml from "js-yaml";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-yaml";
import "prismjs/themes/prism.css";
import { HexColorPicker } from "react-colorful";

import { useApp } from "../context/app-state";

import { SimpleNavBar } from "../components/SimpleNavbar";

export function Settings()
{
    const [yamlText, setYamlText] = useState("");
    const [original, setOriginal] = useState("");
    const [parseError, setParseError] = useState("");
    const isDirty = useMemo(() => yamlText !== original, [yamlText, original]);

    const {state, setTheme, setBgColor} = useApp();

    const handleFile = async () => {
        const text = await window.configAPI.read();
        setYamlText(text ?? "");
        setOriginal(text ?? "");
        setParseError("");
    };

    useEffect(()=>{
        handleFile();
    },[])

    const highlight = (code) => Prism.highlight(code, Prism.languages.yaml, "yaml");

    const onChange = (value) => {
        setYamlText(value);
        try {
            yaml.load(value || "");
            setParseError("");
        } catch (e) {
            setParseError(String(e.message || e));
        }
    };

    const onSave = async () => {
        await window.configAPI.write(yamlText);
        setOriginal(yamlText);
    };

    const handleThemeChange = async (newTheme) => {
        setTheme(newTheme);
        // Update the config YAML with the new theme
        try {
            const config = yaml.load(yamlText || "");
            config.theme = newTheme;
            const updatedYaml = yaml.dump(config);
            await window.configAPI.write(updatedYaml);
            setYamlText(updatedYaml);
            setOriginal(updatedYaml);
        } catch (err) {
            console.error('Failed to save theme to config:', err);
        }
    };

    const handleBgChange = async (newColor) => {
        setBgColor(newColor);
        // Update the config YAML with the new theme
        try {
            const config = yaml.load(yamlText || "");
            config.bgColor = newColor;
            const updatedYaml = yaml.dump(config);
            await window.configAPI.write(updatedYaml);
            setYamlText(updatedYaml);
            setOriginal(updatedYaml);
        } catch (err) {
            console.error('Failed to save theme to config:', err);
        }
    };

    return(
        <div className='bg-neutral-800 w-full h-screen rounded-lg flex flex-col overflow-hidden'>
            <SimpleNavBar title="Settings" />

            <div className="text-white px-8 py-4 flex-1 flex flex-col gap-3 overflow-y-scroll">
                {/* Styling */}
                <p className="text-[24px] font-bold">Styling</p>
                <select value={state.theme} name="selectedTheme" className="bg-neutral-900 text-neutral-400" onChange={e=>handleThemeChange(e.target.value)}>
                    {
                        state.availableThemes.map((i, key) => (
                            <option className="text-neutral-400" value={i} key={key}>{i}</option>
                        ))
                    }
                </select>

                <p>Background Color (HEX)</p>
                <HexColorPicker color={state.bgColor} onChange={handleBgChange} />

                {/* Config */}

                <div className="flex items-center justify-between">
                    <p className="text-[24px] font-bold">Configuration</p>
                    {isDirty && (
                        <button
                            onClick={onSave}
                            disabled={!!parseError}
                            className={`px-4 py-2 rounded font-medium ${parseError ? 'bg-neutral-600 text-neutral-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} `}
                        >
                            Save
                        </button>
                    )}
                </div>

                {parseError && (
                    <div className="text-red-400 text-sm">{parseError}</div>
                )}

                <div className="flex-1 min-h-0 max-h-[400px] w-[80%] rounded bg-neutral-900 border border-neutral-700 overflow-auto">
                    <Editor
                        value={yamlText}
                        onValueChange={onChange}
                        highlight={highlight}
                        padding={16}
                        textareaClassName="outline-none"
                        style={{
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: 14,
                            color: '#e5e7eb'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

