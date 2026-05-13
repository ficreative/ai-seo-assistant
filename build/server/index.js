import { a as login, c as boundary, i as authenticate, l as LoginErrorType, o as registerWebhooks, r as addDocumentResponseHeaders } from "./assets/shopify.server-Df8PYkqy.js";
import { t as prisma } from "./assets/db.server-BzuWsmVg.js";
import { i as BILLING_PLANS, r as reserveIfFreePlan, t as getBillingContext } from "./assets/billing.gating.server-DqsipGCM.js";
import { PassThrough } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { Form, Link, Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, redirect, useActionData, useFetcher, useLoaderData, useLocation, useNavigate, useOutlet, useParams, useRouteError, useSearchParams } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import * as Sentry from "@sentry/node";
import React, { Children, Component, PureComponent, createContext, createElement, createRef, forwardRef, isValidElement, memo, useCallback, useContext, useEffect, useId, useImperativeHandle, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { breakpointsAliases, createThemeClassName, getMediaConditions, themeDefault, themeNameDefault, themeNames, themes } from "@shopify/polaris-tokens";
import { createPortal } from "react-dom";
import isEqual from "react-fast-compare";
import { CSSTransition, Transition, TransitionGroup } from "react-transition-group";
import crypto from "crypto";
import { Queue } from "bullmq";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region app/utils/sentry.server.js
var _inited = false;
function initSentry() {
	if (_inited) return;
	const dsn = process.env.SENTRY_DSN;
	if (!dsn) {
		_inited = true;
		return;
	}
	Sentry.init({
		dsn,
		environment: process.env.SENTRY_ENV || process.env.NODE_ENV || "development",
		tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0)
	});
	_inited = true;
}
function captureException(err, context) {
	try {
		initSentry();
		if (!process.env.SENTRY_DSN) return;
		Sentry.captureException(err, { extra: context || void 0 });
	} catch {}
}
//#endregion
//#region app/entry.server.jsx
var entry_server_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
async function handleRequest(request, responseStatusCode, responseHeaders, reactRouterContext) {
	initSentry();
	addDocumentResponseHeaders(request, responseHeaders);
	const callbackName = isbot(request.headers.get("user-agent") ?? "") ? "onAllReady" : "onShellReady";
	return new Promise((resolve, reject) => {
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: reactRouterContext,
			url: request.url
		}), {
			[callbackName]: () => {
				const body = new PassThrough();
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
				pipe(body);
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				captureException(error, { where: "react-render" });
				console.error(error);
			}
		});
		setTimeout(abort, streamTimeout + 1e3);
	});
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/types.js
var Key = /* @__PURE__ */ function(Key) {
	Key[Key["Backspace"] = 8] = "Backspace";
	Key[Key["Tab"] = 9] = "Tab";
	Key[Key["Enter"] = 13] = "Enter";
	Key[Key["Shift"] = 16] = "Shift";
	Key[Key["Ctrl"] = 17] = "Ctrl";
	Key[Key["Alt"] = 18] = "Alt";
	Key[Key["Pause"] = 19] = "Pause";
	Key[Key["CapsLock"] = 20] = "CapsLock";
	Key[Key["Escape"] = 27] = "Escape";
	Key[Key["Space"] = 32] = "Space";
	Key[Key["PageUp"] = 33] = "PageUp";
	Key[Key["PageDown"] = 34] = "PageDown";
	Key[Key["End"] = 35] = "End";
	Key[Key["Home"] = 36] = "Home";
	Key[Key["LeftArrow"] = 37] = "LeftArrow";
	Key[Key["UpArrow"] = 38] = "UpArrow";
	Key[Key["RightArrow"] = 39] = "RightArrow";
	Key[Key["DownArrow"] = 40] = "DownArrow";
	Key[Key["Insert"] = 45] = "Insert";
	Key[Key["Delete"] = 46] = "Delete";
	Key[Key["Key0"] = 48] = "Key0";
	Key[Key["Key1"] = 49] = "Key1";
	Key[Key["Key2"] = 50] = "Key2";
	Key[Key["Key3"] = 51] = "Key3";
	Key[Key["Key4"] = 52] = "Key4";
	Key[Key["Key5"] = 53] = "Key5";
	Key[Key["Key6"] = 54] = "Key6";
	Key[Key["Key7"] = 55] = "Key7";
	Key[Key["Key8"] = 56] = "Key8";
	Key[Key["Key9"] = 57] = "Key9";
	Key[Key["KeyA"] = 65] = "KeyA";
	Key[Key["KeyB"] = 66] = "KeyB";
	Key[Key["KeyC"] = 67] = "KeyC";
	Key[Key["KeyD"] = 68] = "KeyD";
	Key[Key["KeyE"] = 69] = "KeyE";
	Key[Key["KeyF"] = 70] = "KeyF";
	Key[Key["KeyG"] = 71] = "KeyG";
	Key[Key["KeyH"] = 72] = "KeyH";
	Key[Key["KeyI"] = 73] = "KeyI";
	Key[Key["KeyJ"] = 74] = "KeyJ";
	Key[Key["KeyK"] = 75] = "KeyK";
	Key[Key["KeyL"] = 76] = "KeyL";
	Key[Key["KeyM"] = 77] = "KeyM";
	Key[Key["KeyN"] = 78] = "KeyN";
	Key[Key["KeyO"] = 79] = "KeyO";
	Key[Key["KeyP"] = 80] = "KeyP";
	Key[Key["KeyQ"] = 81] = "KeyQ";
	Key[Key["KeyR"] = 82] = "KeyR";
	Key[Key["KeyS"] = 83] = "KeyS";
	Key[Key["KeyT"] = 84] = "KeyT";
	Key[Key["KeyU"] = 85] = "KeyU";
	Key[Key["KeyV"] = 86] = "KeyV";
	Key[Key["KeyW"] = 87] = "KeyW";
	Key[Key["KeyX"] = 88] = "KeyX";
	Key[Key["KeyY"] = 89] = "KeyY";
	Key[Key["KeyZ"] = 90] = "KeyZ";
	Key[Key["LeftMeta"] = 91] = "LeftMeta";
	Key[Key["RightMeta"] = 92] = "RightMeta";
	Key[Key["Select"] = 93] = "Select";
	Key[Key["Numpad0"] = 96] = "Numpad0";
	Key[Key["Numpad1"] = 97] = "Numpad1";
	Key[Key["Numpad2"] = 98] = "Numpad2";
	Key[Key["Numpad3"] = 99] = "Numpad3";
	Key[Key["Numpad4"] = 100] = "Numpad4";
	Key[Key["Numpad5"] = 101] = "Numpad5";
	Key[Key["Numpad6"] = 102] = "Numpad6";
	Key[Key["Numpad7"] = 103] = "Numpad7";
	Key[Key["Numpad8"] = 104] = "Numpad8";
	Key[Key["Numpad9"] = 105] = "Numpad9";
	Key[Key["Multiply"] = 106] = "Multiply";
	Key[Key["Add"] = 107] = "Add";
	Key[Key["Subtract"] = 109] = "Subtract";
	Key[Key["Decimal"] = 110] = "Decimal";
	Key[Key["Divide"] = 111] = "Divide";
	Key[Key["F1"] = 112] = "F1";
	Key[Key["F2"] = 113] = "F2";
	Key[Key["F3"] = 114] = "F3";
	Key[Key["F4"] = 115] = "F4";
	Key[Key["F5"] = 116] = "F5";
	Key[Key["F6"] = 117] = "F6";
	Key[Key["F7"] = 118] = "F7";
	Key[Key["F8"] = 119] = "F8";
	Key[Key["F9"] = 120] = "F9";
	Key[Key["F10"] = 121] = "F10";
	Key[Key["F11"] = 122] = "F11";
	Key[Key["F12"] = 123] = "F12";
	Key[Key["NumLock"] = 144] = "NumLock";
	Key[Key["ScrollLock"] = 145] = "ScrollLock";
	Key[Key["Semicolon"] = 186] = "Semicolon";
	Key[Key["Equals"] = 187] = "Equals";
	Key[Key["Comma"] = 188] = "Comma";
	Key[Key["Dash"] = 189] = "Dash";
	Key[Key["Period"] = 190] = "Period";
	Key[Key["ForwardSlash"] = 191] = "ForwardSlash";
	Key[Key["GraveAccent"] = 192] = "GraveAccent";
	Key[Key["OpenBracket"] = 219] = "OpenBracket";
	Key[Key["BackSlash"] = 220] = "BackSlash";
	Key[Key["CloseBracket"] = 221] = "CloseBracket";
	Key[Key["SingleQuote"] = 222] = "SingleQuote";
	return Key;
}({});
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/shared.js
var scrollable = {
	props: { "data-polaris-scrollable": true },
	selector: "[data-polaris-scrollable]"
};
var overlay = {
	props: { "data-polaris-overlay": true },
	selector: "[data-polaris-overlay]"
};
var layer = {
	props: { "data-polaris-layer": true },
	selector: "[data-polaris-layer]"
};
var unstyled = {
	props: { "data-polaris-unstyled": true },
	selector: "[data-polaris-unstyled]"
};
var dataPolarisTopBar = {
	props: { "data-polaris-top-bar": true },
	selector: "[data-polaris-top-bar]"
};
var portal = {
	props: ["data-portal-id"],
	selector: "[data-portal-id]"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-theme.js
var ThemeContext = /* @__PURE__ */ createContext(null);
var ThemeNameContext = /* @__PURE__ */ createContext(null);
function getTheme(themeName) {
	return themes[themeName];
}
function useTheme() {
	const theme = useContext(ThemeContext);
	if (!theme) throw new Error("No theme was provided. Your application must be wrapped in an <AppProvider> or <ThemeProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.");
	return theme;
}
function useThemeName() {
	const themeName = useContext(ThemeNameContext);
	if (!themeName) throw new Error("No themeName was provided. Your application must be wrapped in an <AppProvider> or <ThemeProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.");
	return themeName;
}
function UseTheme(props) {
	const theme = useTheme();
	return props.children(theme);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/is-object.js
function isObject(value) {
	const type = typeof value;
	return value != null && (type === "object" || type === "function");
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/css.js
function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}
function variationName(name, value) {
	return `${name}${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
function sanitizeCustomProperties(styles) {
	const nonNullValues = Object.entries(styles).filter(([_, value]) => value != null);
	return nonNullValues.length ? Object.fromEntries(nonNullValues) : void 0;
}
/**
* Given params like so:
* (
*   'button',
*   'padding',
*   'spacing',
*   {
*     sm: "4",
*     lg: "6"
*   }
* )
* Converts it to an object like so:
* {
*   '--pc-button-padding-sm': 'var(--p-spacing-4)',
*   '--pc-button-padding-lg': 'var(--p-spacing-6)'
* }
*
*/
function getResponsiveProps(componentName, componentProp, tokenSubgroup, responsiveProp) {
	if (!responsiveProp) return {};
	let result;
	if (!isObject(responsiveProp)) result = { [breakpointsAliases[0]]: `var(--p-${tokenSubgroup}-${responsiveProp})` };
	else result = Object.fromEntries(Object.entries(responsiveProp).map(([breakpointAlias, aliasOrScale]) => [breakpointAlias, `var(--p-${tokenSubgroup}-${aliasOrScale})`]));
	return Object.fromEntries(Object.entries(result).map(([breakpointAlias, value]) => [`--pc-${componentName}-${componentProp}-${breakpointAlias}`, value]));
}
function getResponsiveValue(componentName, componentProp, responsiveProp) {
	if (!responsiveProp) return {};
	if (!isObject(responsiveProp)) return { [`--pc-${componentName}-${componentProp}-${breakpointsAliases[0]}`]: responsiveProp };
	return Object.fromEntries(Object.entries(responsiveProp).map(([breakpointAlias, responsiveValue]) => [`--pc-${componentName}-${componentProp}-${breakpointAlias}`, responsiveValue]));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ThemeProvider/ThemeProvider.css.js
var styles$70 = { "themeContainer": "Polaris-ThemeProvider--themeContainer" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ThemeProvider/ThemeProvider.js
/**
* Allowlist of local themes
* TODO: Replace `as const` with `satisfies ThemeName[]`
*/
var themeNamesLocal = ["light", "dark-experimental"];
var isThemeNameLocal = (name) => themeNamesLocal.includes(name);
function ThemeProvider(props) {
	const { as: ThemeContainer = "div", children, className, theme: themeName = themeNameDefault } = props;
	return /* @__PURE__ */ React.createElement(ThemeNameContext.Provider, { value: themeName }, /* @__PURE__ */ React.createElement(ThemeContext.Provider, { value: getTheme(themeName) }, /* @__PURE__ */ React.createElement(ThemeContainer, {
		"data-portal-id": props["data-portal-id"],
		className: classNames(createThemeClassName(themeName), styles$70.themeContainer, className)
	}, children)));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/within-content-context.js
var WithinContentContext = /* @__PURE__ */ createContext(false);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/target.js
var isServer = typeof window === "undefined" || typeof document === "undefined";
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-isomorphic-layout-effect.js
var useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect;
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-event-listener.js
/**
* Acceptable target elements for `useEventListener`.
*/
/**
* Extracts the target element from a React `RefObject` or returns the input element.
*/
/**
* Extracts a (lib.dom.ts) EventMap for a given target element.
*/
/**
* Extracts all event names for a given target element.
*/
/**
* Extracts the `event` object for a given event type.
*/
/**
* React hook encapsulating the boilerplate logic for adding and removing event listeners.
*/
function useEventListener(eventName, handler, target, options) {
	const handlerRef = useRef(handler);
	const optionsRef = useRef(options);
	useIsomorphicLayoutEffect(() => {
		handlerRef.current = handler;
	}, [handler]);
	useIsomorphicLayoutEffect(() => {
		optionsRef.current = options;
	}, [options]);
	useEffect(() => {
		if (!(typeof eventName === "string" && target !== null)) return;
		let targetElement;
		if (typeof target === "undefined") targetElement = window;
		else if ("current" in target) {
			if (target.current === null) return;
			targetElement = target.current;
		} else targetElement = target;
		const eventOptions = optionsRef.current;
		const eventListener = (event) => handlerRef.current(event);
		targetElement.addEventListener(eventName, eventListener, eventOptions);
		return () => {
			targetElement.removeEventListener(eventName, eventListener, eventOptions);
		};
	}, [eventName, target]);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-index-resource-state.js
var SelectionType$1 = /* @__PURE__ */ function(SelectionType) {
	SelectionType["All"] = "all";
	SelectionType["Page"] = "page";
	SelectionType["Multi"] = "multi";
	SelectionType["Single"] = "single";
	SelectionType["Range"] = "range";
	return SelectionType;
}({});
function defaultResourceIDResolver(resource) {
	if ("id" in resource) return resource.id;
	throw new Error("Your resource does not directly contain an `id`. Pass a `resourceIDResolver` to `useIndexResourceState`");
}
function useIndexResourceState(resources, { selectedResources: initSelectedResources = [], allResourcesSelected: initAllResourcesSelected = false, resourceIDResolver = defaultResourceIDResolver, resourceFilter = void 0 } = {
	selectedResources: [],
	allResourcesSelected: false,
	resourceIDResolver: defaultResourceIDResolver,
	resourceFilter: void 0
}) {
	const [selectedResources, setSelectedResources] = useState(initSelectedResources);
	const [allResourcesSelected, setAllResourcesSelected] = useState(initAllResourcesSelected);
	return {
		selectedResources,
		allResourcesSelected,
		handleSelectionChange: useCallback((selectionType, isSelecting, selection, _position) => {
			if (selectionType === SelectionType$1.All) setAllResourcesSelected(isSelecting);
			else if (allResourcesSelected) setAllResourcesSelected(false);
			switch (selectionType) {
				case SelectionType$1.Single:
					setSelectedResources((newSelectedResources) => isSelecting ? [...newSelectedResources, selection] : newSelectedResources.filter((id) => id !== selection));
					break;
				case SelectionType$1.All:
				case SelectionType$1.Page:
					if (resourceFilter) {
						const filteredResources = resources.filter(resourceFilter);
						setSelectedResources(isSelecting && selectedResources.length < filteredResources.length ? filteredResources.map(resourceIDResolver) : []);
					} else setSelectedResources(isSelecting ? resources.map(resourceIDResolver) : []);
					break;
				case SelectionType$1.Multi:
					if (!selection) break;
					setSelectedResources((currentSelectedResources) => {
						const ids = [];
						const filteredResources = resourceFilter ? resources.filter(resourceFilter) : resources;
						for (let i = selection[0]; i <= selection[1]; i++) if (filteredResources.includes(resources[i])) {
							const id = resourceIDResolver(resources[i]);
							if (isSelecting && !currentSelectedResources.includes(id) || !isSelecting && currentSelectedResources.includes(id)) ids.push(id);
						}
						return isSelecting ? [...currentSelectedResources, ...ids] : currentSelectedResources.filter((id) => !ids.includes(id));
					});
					break;
				case SelectionType$1.Range:
					if (!selection) break;
					setSelectedResources((currentSelectedResources) => {
						const selectedIds = (resourceFilter ? resources.filter(resourceFilter) : resources).map(resourceIDResolver).slice(Number(selection[0]), Number(selection[1]) + 1);
						const isIndeterminate = selectedIds.some((id) => {
							return selectedResources.includes(id);
						});
						return !selectedIds.every((id) => {
							return selectedResources.includes(id);
						}) && (isSelecting || isIndeterminate) ? [...new Set([...currentSelectedResources, ...selectedIds]).values()] : currentSelectedResources.filter((id) => !selectedIds.includes(id));
					});
					break;
			}
		}, [
			allResourcesSelected,
			resourceFilter,
			selectedResources,
			resources,
			resourceIDResolver
		]),
		clearSelection: useCallback(() => {
			setSelectedResources([]);
			setAllResourcesSelected(false);
		}, []),
		removeSelectedResources: useCallback((removeResources) => {
			const newSelectedResources = [...selectedResources].filter((resource) => !removeResources.includes(resource));
			setSelectedResources(newSelectedResources);
			if (newSelectedResources.length === 0) setAllResourcesSelected(false);
		}, [selectedResources])
	};
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/breakpoints.js
var Breakpoints = {
	navigationBarCollapsed: "767.95px",
	stackedContent: "1039.95px"
};
var noWindowMatches = {
	media: "",
	addListener: noop$9,
	removeListener: noop$9,
	matches: false,
	onchange: noop$9,
	addEventListener: noop$9,
	removeEventListener: noop$9,
	dispatchEvent: (_) => true
};
function noop$9() {}
function navigationBarCollapsed() {
	return isServer ? noWindowMatches : window.matchMedia(`(max-width: ${Breakpoints.navigationBarCollapsed})`);
}
function stackedContent() {
	return isServer ? noWindowMatches : window.matchMedia(`(max-width: ${Breakpoints.stackedContent})`);
}
/**
* Directional alias for each Polaris `breakpoints` token.
*
* @example 'smUp' | 'smDown' | 'smOnly' | 'mdUp' | etc.
*/
/**
* Match results for each directional Polaris `breakpoints` alias.
*/
var hookCallbacks = /* @__PURE__ */ new Set();
var breakpointsQueryEntries = getBreakpointsQueryEntries(themeDefault.breakpoints);
if (!isServer) breakpointsQueryEntries.forEach(([breakpointAlias, query]) => {
	const eventListener = (event) => {
		for (const hookCallback of hookCallbacks) hookCallback(breakpointAlias, event.matches);
	};
	const mql = window.matchMedia(query);
	if (mql.addListener) mql.addListener(eventListener);
	else mql.addEventListener("change", eventListener);
});
function getDefaultMatches(defaults) {
	return Object.fromEntries(breakpointsQueryEntries.map(([directionAlias]) => [directionAlias, typeof defaults === "boolean" ? defaults : defaults?.[directionAlias] ?? false]));
}
function getLiveMatches() {
	return Object.fromEntries(breakpointsQueryEntries.map(([directionAlias, query]) => [directionAlias, window.matchMedia(query).matches]));
}
/**
* Retrieves media query matches for each directional Polaris `breakpoints` alias.
*
* @example
* const {smUp} = useBreakpoints();
* return smUp && 'Hello world';
*
* @example
* const {mdUp} = useBreakpoints({defaults: {mdUp: true}});
* mdUp //=> `true` during SSR
*
* @example
* const breakpoints = useBreakpoints({defaults: true});
* breakpoints //=> All values will be `true` during SSR
*/
function useBreakpoints(options) {
	const [breakpoints, setBreakpoints] = useState(getDefaultMatches(options?.defaults));
	useIsomorphicLayoutEffect(() => {
		setBreakpoints(getLiveMatches());
		const callback = (breakpointAlias, matches) => {
			setBreakpoints((prevBreakpoints) => ({
				...prevBreakpoints,
				[breakpointAlias]: matches
			}));
		};
		hookCallbacks.add(callback);
		return () => {
			hookCallbacks.delete(callback);
		};
	}, []);
	return breakpoints;
}
/**
* Converts `breakpoints` tokens into directional media query entries.
*
* @example
* const breakpointsQueryEntries = getBreakpointsQueryEntries(breakpoints);
* breakpointsQueryEntries === [
*   ['xsUp', '(min-width: ...)'],
*   ['xsDown', '(max-width: ...)'],
*   ['xsOnly', '(min-width: ...) and (max-width: ...)'],
*   ['smUp', '(min-width: ...) and (max-width: ...)'],
*   ['mdUp', '(min-width: ...) and (max-width: ...)'],
*   // etc.
* ]
*/
function getBreakpointsQueryEntries(breakpoints) {
	return Object.entries(getMediaConditions(breakpoints)).map(([breakpointsToken, mediaConditions]) => Object.entries(mediaConditions).map(([direction, mediaCondition]) => {
		return [`${breakpointsToken.split("-")[1]}${capitalize(direction)}`, mediaCondition];
	})).flat();
}
function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/debounce.js
function debounce(func, waitArg, options) {
	let lastArgs;
	let lastThis;
	let maxWait;
	let result;
	let timerId;
	let lastCallTime;
	let lastInvokeTime = 0;
	let leading = false;
	let maxing = false;
	let trailing = true;
	const useRAF = !waitArg && waitArg !== 0;
	if (typeof func !== "function") throw new TypeError("Expected a function");
	const wait = waitArg || 0;
	if (typeof options === "object") {
		leading = Boolean(options.leading);
		maxing = "maxWait" in options;
		maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : void 0;
		trailing = "trailing" in options ? Boolean(options.trailing) : trailing;
	}
	function invokeFunc(time) {
		const args = lastArgs;
		const thisArg = lastThis;
		lastArgs = void 0;
		lastThis = void 0;
		lastInvokeTime = time;
		result = func.apply(thisArg, args);
		return result;
	}
	function startTimer(pendingFunc, wait) {
		if (useRAF) {
			cancelAnimationFrame(timerId);
			return requestAnimationFrame(pendingFunc);
		}
		return setTimeout(pendingFunc, wait);
	}
	function cancelTimer(id) {
		if (useRAF) return cancelAnimationFrame(id);
		clearTimeout(id);
	}
	function leadingEdge(time) {
		lastInvokeTime = time;
		timerId = startTimer(timerExpired, wait);
		return leading ? invokeFunc(time) : result;
	}
	function remainingWait(time) {
		const timeSinceLastCall = time - lastCallTime;
		const timeSinceLastInvoke = time - lastInvokeTime;
		const timeWaiting = wait - timeSinceLastCall;
		return maxing && maxWait ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
	}
	function shouldInvoke(time) {
		const timeSinceLastCall = time - lastCallTime;
		const timeSinceLastInvoke = time - lastInvokeTime;
		return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && maxWait && timeSinceLastInvoke >= maxWait;
	}
	function timerExpired() {
		const time = Date.now();
		if (shouldInvoke(time)) return trailingEdge(time);
		timerId = startTimer(timerExpired, remainingWait(time));
	}
	function trailingEdge(time) {
		timerId = void 0;
		if (trailing && lastArgs) return invokeFunc(time);
		lastArgs = lastThis = void 0;
		return result;
	}
	function cancel() {
		if (timerId !== void 0) cancelTimer(timerId);
		lastInvokeTime = 0;
		lastArgs = lastCallTime = lastThis = timerId = void 0;
	}
	function flush() {
		return timerId === void 0 ? result : trailingEdge(Date.now());
	}
	function pending() {
		return timerId !== void 0;
	}
	function debounced(...args) {
		const time = Date.now();
		const isInvoking = shouldInvoke(time);
		lastArgs = args;
		lastThis = this;
		lastCallTime = time;
		if (isInvoking) {
			if (timerId === void 0) return leadingEdge(lastCallTime);
			if (maxing) {
				timerId = startTimer(timerExpired, wait);
				return invokeFunc(lastCallTime);
			}
		}
		if (timerId === void 0) timerId = startTimer(timerExpired, wait);
		return result;
	}
	debounced.cancel = cancel;
	debounced.flush = flush;
	debounced.pending = pending;
	return debounced;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/geometry.js
var Rect = class Rect {
	static get zero() {
		return new Rect();
	}
	constructor({ top = 0, left = 0, width = 0, height = 0 } = {}) {
		this.top = top;
		this.left = left;
		this.width = width;
		this.height = height;
	}
	get center() {
		return {
			x: this.left + this.width / 2,
			y: this.top + this.height / 2
		};
	}
};
function getRectForNode(node) {
	/**
	* NOTE: We cannot do node instanceof Element because it will fail when inside of an iframe.
	* Technically we can do `node instanceof node.ownerDocument.defaultView.Element`but this will
	* fail when node isn't an Element. We might as well try to run `getBoundingClientRect` and then
	* have a fallback for when that breaks.
	*/
	try {
		const rect = node.getBoundingClientRect();
		return new Rect({
			top: rect.top,
			left: rect.left,
			width: rect.width,
			height: rect.height
		});
	} catch (_) {
		return new Rect({
			width: window.innerWidth,
			height: window.innerHeight
		});
	}
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/sticky-manager/sticky-manager.js
var SIXTY_FPS = 1e3 / 60;
var StickyManager = class {
	constructor(container) {
		this.stickyItems = [];
		this.stuckItems = [];
		this.container = null;
		this.topBarOffset = 0;
		this.handleResize = debounce(() => {
			this.manageStickyItems();
		}, SIXTY_FPS, {
			leading: true,
			trailing: true,
			maxWait: SIXTY_FPS
		});
		this.handleScroll = debounce(() => {
			this.manageStickyItems();
		}, SIXTY_FPS, {
			leading: true,
			trailing: true,
			maxWait: SIXTY_FPS
		});
		if (container) this.setContainer(container);
	}
	registerStickyItem(stickyItem) {
		this.stickyItems.push(stickyItem);
	}
	unregisterStickyItem(nodeToRemove) {
		const nodeIndex = this.stickyItems.findIndex(({ stickyNode }) => nodeToRemove === stickyNode);
		this.stickyItems.splice(nodeIndex, 1);
	}
	getStickyItem(node) {
		return this.stickyItems.find(({ stickyNode }) => node === stickyNode);
	}
	setContainer(el) {
		this.container = el;
		if (isDocument$1(el)) this.setTopBarOffset(el);
		this.container.addEventListener("scroll", this.handleScroll);
		window.addEventListener("resize", this.handleResize);
		this.manageStickyItems();
	}
	removeScrollListener() {
		if (this.container) {
			this.container.removeEventListener("scroll", this.handleScroll);
			window.removeEventListener("resize", this.handleResize);
		}
	}
	manageStickyItems() {
		if (this.stickyItems.length <= 0) return;
		const scrollTop = this.container ? scrollTopFor(this.container) : 0;
		const containerTop = getRectForNode(this.container).top + this.topBarOffset;
		this.stickyItems.forEach((stickyItem) => {
			const { handlePositioning } = stickyItem;
			const { sticky, top, left, width } = this.evaluateStickyItem(stickyItem, scrollTop, containerTop);
			this.updateStuckItems(stickyItem, sticky);
			handlePositioning(sticky, top, left, width);
		});
	}
	evaluateStickyItem(stickyItem, scrollTop, containerTop) {
		const { stickyNode, placeHolderNode, boundingElement, offset, disableWhenStacked } = stickyItem;
		if (disableWhenStacked && stackedContent().matches) return {
			sticky: false,
			top: 0,
			left: 0,
			width: "auto"
		};
		const stickyOffset = offset ? this.getOffset(stickyNode) + parseInt(themeDefault.space["space-500"], 10) : this.getOffset(stickyNode);
		const scrollPosition = scrollTop + stickyOffset;
		const placeHolderNodeCurrentTop = placeHolderNode.getBoundingClientRect().top - containerTop + scrollTop;
		const top = containerTop + stickyOffset;
		const width = placeHolderNode.getBoundingClientRect().width;
		const left = placeHolderNode.getBoundingClientRect().left;
		let sticky;
		if (boundingElement == null) sticky = scrollPosition >= placeHolderNodeCurrentTop;
		else {
			const stickyItemHeight = stickyNode.getBoundingClientRect().height || stickyNode.firstElementChild?.getBoundingClientRect().height || 0;
			const stickyItemBottomPosition = boundingElement.getBoundingClientRect().bottom - stickyItemHeight + scrollTop - containerTop;
			sticky = scrollPosition >= placeHolderNodeCurrentTop && scrollPosition < stickyItemBottomPosition;
		}
		return {
			sticky,
			top,
			left,
			width
		};
	}
	updateStuckItems(item, sticky) {
		const { stickyNode } = item;
		if (sticky && !this.isNodeStuck(stickyNode)) this.addStuckItem(item);
		else if (!sticky && this.isNodeStuck(stickyNode)) this.removeStuckItem(item);
	}
	addStuckItem(stickyItem) {
		this.stuckItems.push(stickyItem);
	}
	removeStuckItem(stickyItem) {
		const { stickyNode: nodeToRemove } = stickyItem;
		const nodeIndex = this.stuckItems.findIndex(({ stickyNode }) => nodeToRemove === stickyNode);
		this.stuckItems.splice(nodeIndex, 1);
	}
	getOffset(node) {
		if (this.stuckItems.length === 0) return 0;
		let offset = 0;
		let count = 0;
		const stuckNodesLength = this.stuckItems.length;
		const nodeRect = getRectForNode(node);
		while (count < stuckNodesLength) {
			const stuckNode = this.stuckItems[count].stickyNode;
			if (stuckNode !== node) {
				if (!horizontallyOverlaps(nodeRect, getRectForNode(stuckNode))) offset += getRectForNode(stuckNode).height;
			} else break;
			count++;
		}
		return offset;
	}
	isNodeStuck(node) {
		return this.stuckItems.findIndex(({ stickyNode }) => node === stickyNode) >= 0;
	}
	setTopBarOffset(container) {
		const topbarElement = container.querySelector(`:not(${scrollable.selector}) ${dataPolarisTopBar.selector}`);
		this.topBarOffset = topbarElement ? topbarElement.clientHeight : 0;
	}
};
function isDocument$1(node) {
	return node === document;
}
function scrollTopFor(container) {
	return isDocument$1(container) ? document.body.scrollTop || document.documentElement.scrollTop : container.scrollTop;
}
function horizontallyOverlaps(rect1, rect2) {
	const rect1Left = rect1.left;
	const rect1Right = rect1.left + rect1.width;
	const rect2Left = rect2.left;
	return rect2.left + rect2.width < rect1Left || rect1Right < rect2Left;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/scroll-lock-manager/scroll-lock-manager.js
var SCROLL_LOCKING_ATTRIBUTE = "data-lock-scrolling";
var SCROLL_LOCKING_HIDDEN_ATTRIBUTE = "data-lock-scrolling-hidden";
var SCROLL_LOCKING_WRAPPER_ATTRIBUTE = "data-lock-scrolling-wrapper";
var scrollPosition = 0;
function isScrollBarVisible() {
	const { body } = document;
	return body.scrollHeight > body.clientHeight;
}
var ScrollLockManager = class {
	constructor() {
		this.scrollLocks = 0;
		this.locked = false;
	}
	registerScrollLock() {
		this.scrollLocks += 1;
		this.handleScrollLocking();
	}
	unregisterScrollLock() {
		this.scrollLocks -= 1;
		this.handleScrollLocking();
	}
	handleScrollLocking() {
		if (isServer) return;
		const { scrollLocks } = this;
		const { body } = document;
		const wrapper = body.firstElementChild;
		if (scrollLocks === 0) {
			body.removeAttribute(SCROLL_LOCKING_ATTRIBUTE);
			body.removeAttribute(SCROLL_LOCKING_HIDDEN_ATTRIBUTE);
			if (wrapper) wrapper.removeAttribute(SCROLL_LOCKING_WRAPPER_ATTRIBUTE);
			window.scroll(0, scrollPosition);
			this.locked = false;
		} else if (scrollLocks > 0 && !this.locked) {
			scrollPosition = window.pageYOffset;
			body.setAttribute(SCROLL_LOCKING_ATTRIBUTE, "");
			if (!isScrollBarVisible()) body.setAttribute(SCROLL_LOCKING_HIDDEN_ATTRIBUTE, "");
			if (wrapper) {
				wrapper.setAttribute(SCROLL_LOCKING_WRAPPER_ATTRIBUTE, "");
				wrapper.scrollTop = scrollPosition;
			}
			this.locked = true;
		}
	}
	resetScrollPosition() {
		scrollPosition = 0;
	}
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/get.js
var OBJECT_NOTATION_MATCHER = /\[(.*?)\]|(\w+)/g;
function get(obj, keypath, defaultValue) {
	if (obj == null) return void 0;
	const keys = Array.isArray(keypath) ? keypath : getKeypath(keypath);
	let acc = obj;
	for (let i = 0; i < keys.length; i++) {
		const val = acc[keys[i]];
		if (val === void 0) return defaultValue;
		acc = val;
	}
	return acc;
}
function getKeypath(str) {
	const path = [];
	let result;
	while (result = OBJECT_NOTATION_MATCHER.exec(str)) {
		const [, first, second] = result;
		path.push(first || second);
	}
	return path;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/merge.js
function merge(...objs) {
	let final = {};
	for (const obj of objs) final = mergeRecursively(final, obj);
	return final;
}
function mergeRecursively(inputObjA, objB) {
	const objA = Array.isArray(inputObjA) ? [...inputObjA] : { ...inputObjA };
	for (const key in objB) if (!Object.prototype.hasOwnProperty.call(objB, key)) continue;
	else if (isMergeableValue(objB[key]) && isMergeableValue(objA[key])) objA[key] = mergeRecursively(objA[key], objB[key]);
	else objA[key] = objB[key];
	return objA;
}
function isMergeableValue(value) {
	return value !== null && typeof value === "object";
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/i18n/I18n.js
var REPLACE_REGEX$1 = /{([^}]*)}/g;
var I18n = class {
	/**
	* @param translation A locale object or array of locale objects that overrides default translations. If specifying an array then your desired language dictionary should come first, followed by your fallback language dictionaries
	*/
	constructor(translation) {
		this.translation = {};
		this.translation = Array.isArray(translation) ? merge(...translation.slice().reverse()) : translation;
	}
	translate(id, replacements) {
		const text = get(this.translation, id, "");
		if (!text) return "";
		if (replacements) return text.replace(REPLACE_REGEX$1, (match) => {
			const replacement = match.substring(1, match.length - 1);
			if (replacements[replacement] === void 0) {
				const replacementData = JSON.stringify(replacements);
				throw new Error(`Error in translation for key '${id}'. No replacement found for key '${replacement}'. The following replacements were passed: '${replacementData}'`);
			}
			return replacements[replacement];
		});
		return text;
	}
	translationKeyExists(path) {
		return Boolean(get(this.translation, path));
	}
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/features/context.js
var FeaturesContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/i18n/context.js
var I18nContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/scroll-lock-manager/context.js
var ScrollLockManagerContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/sticky-manager/context.js
var StickyManagerContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/link/context.js
var LinkContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/media-query/context.js
var MediaQueryContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/EventListener/EventListener.js
/** @deprecated Use the useEventListener hook instead. */
var EventListener = class extends PureComponent {
	componentDidMount() {
		this.attachListener();
	}
	componentDidUpdate({ passive, ...detachProps }) {
		this.detachListener(detachProps);
		this.attachListener();
	}
	componentWillUnmount() {
		this.detachListener();
	}
	render() {
		return null;
	}
	attachListener() {
		const { event, handler, capture, passive, window: customWindow } = this.props;
		(customWindow || globalThis.window).addEventListener(event, handler, {
			capture,
			passive
		});
	}
	detachListener(prevProps) {
		const { event, handler, capture, window: customWindow } = prevProps || this.props;
		(customWindow || globalThis.window).removeEventListener(event, handler, capture);
	}
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/MediaQueryProvider/MediaQueryProvider.js
var MediaQueryProvider = function MediaQueryProvider({ children }) {
	const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
	const handleResize = useCallback(debounce(() => {
		if (isNavigationCollapsed !== navigationBarCollapsed().matches) setIsNavigationCollapsed(!isNavigationCollapsed);
	}, 40, {
		trailing: true,
		leading: true,
		maxWait: 40
	}), [isNavigationCollapsed]);
	useEffect(() => {
		setIsNavigationCollapsed(navigationBarCollapsed().matches);
	}, []);
	const context = useMemo(() => ({ isNavigationCollapsed }), [isNavigationCollapsed]);
	return /* @__PURE__ */ React.createElement(MediaQueryContext.Provider, { value: context }, /* @__PURE__ */ React.createElement(EventListener, {
		event: "resize",
		handler: handleResize
	}), children);
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-is-after-initial-mount.js
/**
* useIsAfterInitialMount will trigger a re-render to provide
* you with an updated value. Using this you enhance server-side
* code that can only run on the client.
* @returns MutableRefObject<T> - Returns a ref object with the
* results from invoking initial value
* @example
* function ComponentExample({children}) {
*  const isMounted = useIsAfterInitialMount();
*  const content = isMounted ? children : null;
*
*  return <>{content}</>;
* }
*/
function useIsAfterInitialMount() {
	const [isAfterInitialMount, setIsAfterInitialMount] = useState(false);
	useEffect(() => {
		setIsAfterInitialMount(true);
	}, []);
	return isAfterInitialMount;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/portals/context.js
var PortalsManagerContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/PortalsManager/components/PortalsContainer/PortalsContainer.js
function PortalsContainerComponent(_props, ref) {
	return /* @__PURE__ */ React.createElement("div", {
		id: "PolarisPortalsContainer",
		ref
	});
}
var PortalsContainer = /* @__PURE__ */ forwardRef(PortalsContainerComponent);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/PortalsManager/PortalsManager.js
function PortalsManager({ children, container }) {
	const isMounted = useIsAfterInitialMount();
	const ref = useRef(null);
	const contextValue = useMemo(() => {
		if (container) return { container };
		else if (isMounted) return { container: ref.current };
		else return { container: null };
	}, [container, isMounted]);
	return /* @__PURE__ */ React.createElement(PortalsManagerContext.Provider, { value: contextValue }, children, container ? null : /* @__PURE__ */ React.createElement(PortalsContainer, { ref }));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/focus-manager/context.js
var FocusManagerContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/FocusManager/FocusManager.js
function FocusManager({ children }) {
	const [trapFocusList, setTrapFocusList] = useState([]);
	const add = useCallback((id) => {
		setTrapFocusList((list) => [...list, id]);
	}, []);
	const remove = useCallback((id) => {
		let removed = true;
		setTrapFocusList((list) => {
			const clone = [...list];
			const index = clone.indexOf(id);
			if (index === -1) removed = false;
			else clone.splice(index, 1);
			return clone;
		});
		return removed;
	}, []);
	const value = useMemo(() => ({
		trapFocusList,
		add,
		remove
	}), [
		add,
		trapFocusList,
		remove
	]);
	return /* @__PURE__ */ React.createElement(FocusManagerContext.Provider, { value }, children);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/ephemeral-presence-manager/context.js
var EphemeralPresenceManagerContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/EphemeralPresenceManager/EphemeralPresenceManager.js
var defaultState = {
	tooltip: 0,
	hovercard: 0
};
function EphemeralPresenceManager({ children }) {
	const [presenceCounter, setPresenceCounter] = useState(defaultState);
	const addPresence = useCallback((key) => {
		setPresenceCounter((prevList) => ({
			...prevList,
			[key]: prevList[key] + 1
		}));
	}, []);
	const removePresence = useCallback((key) => {
		setPresenceCounter((prevList) => ({
			...prevList,
			[key]: prevList[key] - 1
		}));
	}, []);
	const value = useMemo(() => ({
		presenceList: Object.entries(presenceCounter).reduce((previousValue, currentValue) => {
			const [key, value] = currentValue;
			return {
				...previousValue,
				[key]: value >= 1
			};
		}, {}),
		presenceCounter,
		addPresence,
		removePresence
	}), [
		addPresence,
		removePresence,
		presenceCounter
	]);
	return /* @__PURE__ */ React.createElement(EphemeralPresenceManagerContext.Provider, { value }, children);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/AppProvider/AppProvider.js
var MAX_SCROLLBAR_WIDTH = 20;
var SCROLLBAR_TEST_ELEMENT_PARENT_SIZE = 30;
var SCROLLBAR_TEST_ELEMENT_CHILD_SIZE = SCROLLBAR_TEST_ELEMENT_PARENT_SIZE + 10;
function measureScrollbars() {
	const parentEl = document.createElement("div");
	parentEl.setAttribute("style", `position: absolute; opacity: 0; transform: translate3d(-9999px, -9999px, 0); pointer-events: none; width:${SCROLLBAR_TEST_ELEMENT_PARENT_SIZE}px; height:${SCROLLBAR_TEST_ELEMENT_PARENT_SIZE}px;`);
	const child = document.createElement("div");
	child.setAttribute("style", `width:100%; height: ${SCROLLBAR_TEST_ELEMENT_CHILD_SIZE}; overflow:scroll; scrollbar-width: thin;`);
	parentEl.appendChild(child);
	document.body.appendChild(parentEl);
	const scrollbarWidth = SCROLLBAR_TEST_ELEMENT_PARENT_SIZE - (parentEl.firstElementChild?.clientWidth ?? 0);
	const scrollbarWidthWithSafetyHatch = Math.min(scrollbarWidth, MAX_SCROLLBAR_WIDTH);
	document.documentElement.style.setProperty("--pc-app-provider-scrollbar-width", `${scrollbarWidthWithSafetyHatch}px`);
	document.body.removeChild(parentEl);
}
var AppProvider$1 = class extends Component {
	constructor(props) {
		super(props);
		this.setBodyStyles = () => {
			document.body.style.backgroundColor = "var(--p-color-bg)";
			document.body.style.color = "var(--p-color-text)";
		};
		this.setRootAttributes = () => {
			const activeThemeName = this.getThemeName();
			themeNames.forEach((themeName) => {
				document.documentElement.classList.toggle(createThemeClassName(themeName), themeName === activeThemeName);
			});
		};
		this.getThemeName = () => this.props.theme ?? themeNameDefault;
		this.stickyManager = new StickyManager();
		this.scrollLockManager = new ScrollLockManager();
		const { i18n, linkComponent } = this.props;
		this.state = {
			link: linkComponent,
			intl: new I18n(i18n)
		};
	}
	componentDidMount() {
		if (document != null) {
			this.stickyManager.setContainer(document);
			this.setBodyStyles();
			this.setRootAttributes();
			const isSafari16 = navigator.userAgent.includes("Safari") && !navigator.userAgent.includes("Chrome") && (navigator.userAgent.includes("Version/16.1") || navigator.userAgent.includes("Version/16.2") || navigator.userAgent.includes("Version/16.3"));
			const isMobileApp16 = navigator.userAgent.includes("Shopify Mobile/iOS") && (navigator.userAgent.includes("OS 16_1") || navigator.userAgent.includes("OS 16_2") || navigator.userAgent.includes("OS 16_3"));
			if (isSafari16 || isMobileApp16) document.documentElement.classList.add("Polaris-Safari-16-Font-Optical-Sizing-Patch");
		}
		measureScrollbars();
	}
	componentDidUpdate({ i18n: prevI18n, linkComponent: prevLinkComponent }) {
		const { i18n, linkComponent } = this.props;
		this.setRootAttributes();
		if (i18n === prevI18n && linkComponent === prevLinkComponent) return;
		this.setState({
			link: linkComponent,
			intl: new I18n(i18n)
		});
	}
	render() {
		const { children, features = {} } = this.props;
		const themeName = this.getThemeName();
		const { intl, link } = this.state;
		return /* @__PURE__ */ React.createElement(ThemeNameContext.Provider, { value: themeName }, /* @__PURE__ */ React.createElement(ThemeContext.Provider, { value: getTheme(themeName) }, /* @__PURE__ */ React.createElement(FeaturesContext.Provider, { value: features }, /* @__PURE__ */ React.createElement(I18nContext.Provider, { value: intl }, /* @__PURE__ */ React.createElement(ScrollLockManagerContext.Provider, { value: this.scrollLockManager }, /* @__PURE__ */ React.createElement(StickyManagerContext.Provider, { value: this.stickyManager }, /* @__PURE__ */ React.createElement(LinkContext.Provider, { value: link }, /* @__PURE__ */ React.createElement(MediaQueryProvider, null, /* @__PURE__ */ React.createElement(PortalsManager, null, /* @__PURE__ */ React.createElement(FocusManager, null, /* @__PURE__ */ React.createElement(EphemeralPresenceManager, null, children)))))))))));
	}
};
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/AlertCircleIcon.svg.mjs
var SvgAlertCircleIcon = function SvgAlertCircleIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z" }), /* @__PURE__ */ React.createElement("path", { d: "M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" }), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
	}));
};
SvgAlertCircleIcon.displayName = "AlertCircleIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/AlertDiamondIcon.svg.mjs
var SvgAlertDiamondIcon = function SvgAlertDiamondIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z" }), /* @__PURE__ */ React.createElement("path", { d: "M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" }), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M11.237 3.177a1.75 1.75 0 0 0-2.474 0l-5.586 5.585a1.75 1.75 0 0 0 0 2.475l5.586 5.586a1.75 1.75 0 0 0 2.474 0l5.586-5.586a1.75 1.75 0 0 0 0-2.475l-5.586-5.585Zm-1.414 1.06a.25.25 0 0 1 .354 0l5.586 5.586a.25.25 0 0 1 0 .354l-5.586 5.585a.25.25 0 0 1-.354 0l-5.586-5.585a.25.25 0 0 1 0-.354l5.586-5.586Z"
	}));
};
SvgAlertDiamondIcon.displayName = "AlertDiamondIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/AlertTriangleIcon.svg.mjs
var SvgAlertTriangleIcon = function SvgAlertTriangleIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M10 6.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 1 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z" }), /* @__PURE__ */ React.createElement("path", { d: "M11 13.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" }), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M10 3.5c-1.045 0-1.784.702-2.152 1.447a449.26 449.26 0 0 1-2.005 3.847l-.028.052a403.426 403.426 0 0 0-2.008 3.856c-.372.752-.478 1.75.093 2.614.57.863 1.542 1.184 2.464 1.184h7.272c.922 0 1.895-.32 2.464-1.184.57-.864.465-1.862.093-2.614-.21-.424-1.113-2.147-2.004-3.847l-.032-.061a429.497 429.497 0 0 1-2.005-3.847c-.368-.745-1.107-1.447-2.152-1.447Zm-.808 2.112c.404-.816 1.212-.816 1.616 0 .202.409 1.112 2.145 2.022 3.88a418.904 418.904 0 0 1 2.018 3.875c.404.817 0 1.633-1.212 1.633h-7.272c-1.212 0-1.617-.816-1.212-1.633.202-.408 1.113-2.147 2.023-3.883a421.932 421.932 0 0 0 2.017-3.872Z"
	}));
};
SvgAlertTriangleIcon.displayName = "AlertTriangleIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/ArrowDownIcon.svg.mjs
var SvgArrowDownIcon = function SvgArrowDownIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M10 3.5a.75.75 0 0 1 .75.75v9.69l2.72-2.72a.75.75 0 0 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 1.06-1.06l2.72 2.72v-9.69a.75.75 0 0 1 .75-.75Z"
	}));
};
SvgArrowDownIcon.displayName = "ArrowDownIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/ArrowLeftIcon.svg.mjs
var SvgArrowLeftIcon = function SvgArrowLeftIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M16.5 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 1 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z"
	}));
};
SvgArrowLeftIcon.displayName = "ArrowLeftIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/ArrowUpIcon.svg.mjs
var SvgArrowUpIcon = function SvgArrowUpIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M10 16.5a.75.75 0 0 1-.75-.75v-9.69l-2.72 2.72a.75.75 0 1 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 1 1-1.06 1.06l-2.72-2.72v9.69a.75.75 0 0 1-.75.75Z"
	}));
};
SvgArrowUpIcon.displayName = "ArrowUpIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/CheckIcon.svg.mjs
var SvgCheckIcon = function SvgCheckIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M15.78 5.97a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06l2.72 2.72 5.97-5.97a.75.75 0 0 1 1.06 0Z"
	}));
};
SvgCheckIcon.displayName = "CheckIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/ChevronDownIcon.svg.mjs
var SvgChevronDownIcon = function SvgChevronDownIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M5.72 8.47a.75.75 0 0 1 1.06 0l3.47 3.47 3.47-3.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 0 1 0-1.06Z"
	}));
};
SvgChevronDownIcon.displayName = "ChevronDownIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/ChevronLeftIcon.svg.mjs
var SvgChevronLeftIcon = function SvgChevronLeftIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M11.764 5.204a.75.75 0 0 1 .032 1.06l-3.516 3.736 3.516 3.736a.75.75 0 1 1-1.092 1.028l-4-4.25a.75.75 0 0 1 0-1.028l4-4.25a.75.75 0 0 1 1.06-.032Z"
	}));
};
SvgChevronLeftIcon.displayName = "ChevronLeftIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/ChevronRightIcon.svg.mjs
var SvgChevronRightIcon = function SvgChevronRightIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M7.72 14.53a.75.75 0 0 1 0-1.06l3.47-3.47-3.47-3.47a.75.75 0 0 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0Z"
	}));
};
SvgChevronRightIcon.displayName = "ChevronRightIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/ChevronUpIcon.svg.mjs
var SvgChevronUpIcon = function SvgChevronUpIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M14.53 12.28a.75.75 0 0 1-1.06 0l-3.47-3.47-3.47 3.47a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06Z"
	}));
};
SvgChevronUpIcon.displayName = "ChevronUpIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/DeleteIcon.svg.mjs
var SvgDeleteIcon = function SvgDeleteIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M11.5 8.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 .75-.75Z" }), /* @__PURE__ */ React.createElement("path", { d: "M9.25 9a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 0 1.5 0v-4.25Z" }), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M7.25 5.25a2.75 2.75 0 0 1 5.5 0h3a.75.75 0 0 1 0 1.5h-.75v5.45c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327h-.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-5.45h-.75a.75.75 0 0 1 0-1.5h3Zm1.5 0a1.25 1.25 0 1 1 2.5 0h-2.5Zm-2.25 1.5h7v5.45c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.128.633a1.5 1.5 0 0 1-.655.655c-.074.038-.225.095-.633.128-.425.035-.983.036-1.848.036h-.4c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.128a1.5 1.5 0 0 1-.656-.655c-.037-.074-.094-.225-.127-.633-.035-.425-.036-.983-.036-1.848v-5.45Z"
	}));
};
SvgDeleteIcon.displayName = "DeleteIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/DuplicateIcon.svg.mjs
var SvgDuplicateIcon = function SvgDuplicateIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M11.25 8.5c-.414 0-.75.336-.75.75v1.25h-1.25c-.414 0-.75.336-.75.75s.336.75.75.75h1.25v1.25c0 .414.336.75.75.75s.75-.336.75-.75v-1.25h1.25c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-1.25v-1.25c0-.414-.336-.75-.75-.75Z" }), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M8.75 16.5c-1.438 0-2.618-1.104-2.74-2.51-1.406-.122-2.51-1.302-2.51-2.74v-5c0-1.519 1.231-2.75 2.75-2.75h5c1.438 0 2.618 1.104 2.74 2.51 1.406.122 2.51 1.302 2.51 2.74v5c0 1.519-1.231 2.75-2.75 2.75h-5Zm0-10.5c-1.519 0-2.75 1.231-2.75 2.75v3.725c-.57-.116-1-.62-1-1.225v-5c0-.69.56-1.25 1.25-1.25h5c.605 0 1.11.43 1.225 1h-3.725Zm0 1.5c-.69 0-1.25.56-1.25 1.25v5c0 .69.56 1.25 1.25 1.25h5c.69 0 1.25-.56 1.25-1.25v-5c0-.69-.56-1.25-1.25-1.25h-5Z"
	}));
};
SvgDuplicateIcon.displayName = "DuplicateIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/EditIcon.svg.mjs
var SvgEditIcon = function SvgEditIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M15.655 4.344a2.695 2.695 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.008.01-5.88 5.88a2.75 2.75 0 0 0-.805 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.539a2.695 2.695 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88-1.689-1.69Zm2.75.629.599-.599a1.195 1.195 0 1 0-1.69-1.689l-.598.599 1.69 1.689Z"
	}));
};
SvgEditIcon.displayName = "EditIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/FilterIcon.svg.mjs
var SvgFilterIcon = function SvgFilterIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M3 6a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5h-12.5a.75.75 0 0 1-.75-.75Z" }), /* @__PURE__ */ React.createElement("path", { d: "M6.75 14a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75Z" }), /* @__PURE__ */ React.createElement("path", { d: "M5.5 9.25a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z" }));
};
SvgFilterIcon.displayName = "FilterIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/InfoIcon.svg.mjs
var SvgInfoIcon = function SvgInfoIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M10 14a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.75.75Z" }), /* @__PURE__ */ React.createElement("path", { d: "M9 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" }), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
	}));
};
SvgInfoIcon.displayName = "InfoIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/LayoutColumns3Icon.svg.mjs
var SvgLayoutColumns3Icon = function SvgLayoutColumns3Icon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M3 6.75c0-2.071 1.679-3.75 3.75-3.75h6.5c2.071 0 3.75 1.679 3.75 3.75v6.5c0 2.071-1.679 3.75-3.75 3.75h-6.5c-2.071 0-3.75-1.679-3.75-3.75v-6.5Zm3.75-2.25c-1.243 0-2.25 1.007-2.25 2.25v6.5c0 1.243 1.007 2.25 2.25 2.25h.5v-11h-.5Zm4.5 11h-2.5v-11h2.5v11Zm1.5 0h.5c1.243 0 2.25-1.007 2.25-2.25v-6.5c0-1.243-1.007-2.25-2.25-2.25h-.5v11Z"
	}));
};
SvgLayoutColumns3Icon.displayName = "LayoutColumns3Icon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/MenuHorizontalIcon.svg.mjs
var SvgMenuHorizontalIcon = function SvgMenuHorizontalIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M6 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" }), /* @__PURE__ */ React.createElement("path", { d: "M11.5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" }), /* @__PURE__ */ React.createElement("path", { d: "M17 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" }));
};
SvgMenuHorizontalIcon.displayName = "MenuHorizontalIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/MinusIcon.svg.mjs
var SvgMinusIcon = function SvgMinusIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M5 10c0-.414.336-.75.75-.75h8.5c.414 0 .75.336.75.75s-.336.75-.75.75h-8.5c-.414 0-.75-.336-.75-.75Z"
	}));
};
SvgMinusIcon.displayName = "MinusIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/PlusIcon.svg.mjs
var SvgPlusIcon = function SvgPlusIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M10.75 5.75c0-.414-.336-.75-.75-.75s-.75.336-.75.75v3.5h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5Z" }));
};
SvgPlusIcon.displayName = "PlusIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/SearchIcon.svg.mjs
var SvgSearchIcon = function SvgSearchIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M12.323 13.383a5.5 5.5 0 1 1 1.06-1.06l2.897 2.897a.75.75 0 1 1-1.06 1.06l-2.897-2.897Zm.677-4.383a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
	}));
};
SvgSearchIcon.displayName = "SearchIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/SelectIcon.svg.mjs
var SvgSelectIcon = function SvgSelectIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M10.884 4.323a1.25 1.25 0 0 0-1.768 0l-2.646 2.647a.75.75 0 0 0 1.06 1.06l2.47-2.47 2.47 2.47a.75.75 0 1 0 1.06-1.06l-2.646-2.647Z" }), /* @__PURE__ */ React.createElement("path", { d: "m13.53 13.03-2.646 2.647a1.25 1.25 0 0 1-1.768 0l-2.646-2.647a.75.75 0 0 1 1.06-1.06l2.47 2.47 2.47-2.47a.75.75 0 0 1 1.06 1.06Z" }));
};
SvgSelectIcon.displayName = "SelectIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/SortAscendingIcon.svg.mjs
var SvgSortAscendingIcon = function SvgSortAscendingIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M9.116 4.323a1.25 1.25 0 0 1 1.768 0l2.646 2.647a.75.75 0 0 1-1.06 1.06l-2.47-2.47-2.47 2.47a.75.75 0 1 1-1.06-1.06l2.646-2.647Z"
	}), /* @__PURE__ */ React.createElement("path", {
		fillOpacity: .33,
		fillRule: "evenodd",
		d: "M9.116 15.677a1.25 1.25 0 0 0 1.768 0l2.646-2.647a.75.75 0 0 0-1.06-1.06l-2.47 2.47-2.47-2.47a.75.75 0 0 0-1.06 1.06l2.646 2.647Z"
	}));
};
SvgSortAscendingIcon.displayName = "SortAscendingIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/SortDescendingIcon.svg.mjs
var SvgSortDescendingIcon = function SvgSortDescendingIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", {
		fillOpacity: .33,
		fillRule: "evenodd",
		d: "M9.116 4.823a1.25 1.25 0 0 1 1.768 0l2.646 2.647a.75.75 0 0 1-1.06 1.06l-2.47-2.47-2.47 2.47a.75.75 0 1 1-1.06-1.06l2.646-2.647Z"
	}), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M9.116 15.177a1.25 1.25 0 0 0 1.768 0l2.646-2.647a.75.75 0 0 0-1.06-1.06l-2.47 2.47-2.47-2.47a.75.75 0 0 0-1.06 1.06l2.646 2.647Z"
	}));
};
SvgSortDescendingIcon.displayName = "SortDescendingIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/SortIcon.svg.mjs
var SvgSortIcon = function SvgSortIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M7.75 6.06v7.69a.75.75 0 0 1-1.5 0v-7.69l-1.72 1.72a.75.75 0 0 1-1.06-1.06l3-3a.75.75 0 0 1 1.06 0l3 3a.75.75 0 1 1-1.06 1.06l-1.72-1.72Z" }), /* @__PURE__ */ React.createElement("path", { d: "M13.75 6.25a.75.75 0 0 0-1.5 0v7.69l-1.72-1.72a.75.75 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72v-7.69Z" }));
};
SvgSortIcon.displayName = "SortIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/XCircleIcon.svg.mjs
var SvgXCircleIcon = function SvgXCircleIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M13.03 6.97a.75.75 0 0 1 0 1.06l-1.97 1.97 1.97 1.97a.75.75 0 1 1-1.06 1.06l-1.97-1.97-1.97 1.97a.75.75 0 0 1-1.06-1.06l1.97-1.97-1.97-1.97a.75.75 0 0 1 1.06-1.06l1.97 1.97 1.97-1.97a.75.75 0 0 1 1.06 0Z" }), /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0-1.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
	}));
};
SvgXCircleIcon.displayName = "XCircleIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/XIcon.svg.mjs
var SvgXIcon = function SvgXIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M13.97 15.03a.75.75 0 1 0 1.06-1.06l-3.97-3.97 3.97-3.97a.75.75 0 0 0-1.06-1.06l-3.97 3.97-3.97-3.97a.75.75 0 0 0-1.06 1.06l3.97 3.97-3.97 3.97a.75.75 0 1 0 1.06 1.06l3.97-3.97 3.97 3.97Z" }));
};
SvgXIcon.displayName = "XIcon";
//#endregion
//#region node_modules/@shopify/polaris-icons/dist/icons/XSmallIcon.svg.mjs
var SvgXSmallIcon = function SvgXSmallIcon(props) {
	return /* @__PURE__ */ React.createElement("svg", Object.assign({ viewBox: "0 0 20 20" }, props), /* @__PURE__ */ React.createElement("path", { d: "M12.72 13.78a.75.75 0 1 0 1.06-1.06l-2.72-2.72 2.72-2.72a.75.75 0 0 0-1.06-1.06l-2.72 2.72-2.72-2.72a.75.75 0 0 0-1.06 1.06l2.72 2.72-2.72 2.72a.75.75 0 1 0 1.06 1.06l2.72-2.72 2.72 2.72Z" }));
};
SvgXSmallIcon.displayName = "XSmallIcon";
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/is-element-in-viewport.js
function isElementInViewport(element) {
	const { top, left, bottom, right } = element.getBoundingClientRect();
	const window = element.ownerDocument.defaultView || globalThis.window;
	return top >= 0 && right <= window.innerWidth && bottom <= window.innerHeight && left >= 0;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/focus.js
var FOCUSABLE_SELECTOR = "a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not([aria-disabled=\"true\"]):not([tabindex=\"-1\"]):not(:disabled),*[tabindex]";
var KEYBOARD_FOCUSABLE_SELECTORS = "a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not([aria-disabled=\"true\"]):not([tabindex=\"-1\"]):not(:disabled),*[tabindex]:not([tabindex=\"-1\"])";
var MENUITEM_FOCUSABLE_SELECTORS = "a[role=\"menuitem\"],frame[role=\"menuitem\"],iframe[role=\"menuitem\"],input[role=\"menuitem\"]:not([type=hidden]):not(:disabled),select[role=\"menuitem\"]:not(:disabled),textarea[role=\"menuitem\"]:not(:disabled),button[role=\"menuitem\"]:not(:disabled),*[tabindex]:not([tabindex=\"-1\"])";
var handleMouseUpByBlurring = ({ currentTarget }) => currentTarget.blur();
function nextFocusableNode(node, filter) {
	const allFocusableElements = [...document.querySelectorAll(FOCUSABLE_SELECTOR)];
	const sliceLocation = allFocusableElements.indexOf(node) + 1;
	const focusableElementsAfterNode = allFocusableElements.slice(sliceLocation);
	for (const focusableElement of focusableElementsAfterNode) if (isElementInViewport(focusableElement) && (!filter || filter && filter(focusableElement))) return focusableElement;
	return null;
}
function findFirstFocusableNode(element, onlyDescendants = true) {
	if (!onlyDescendants && matches(element, FOCUSABLE_SELECTOR)) return element;
	return element.querySelector(FOCUSABLE_SELECTOR);
}
function findFirstFocusableNodeIncludingDisabled(element) {
	const focusableSelector = `a,button,frame,iframe,input:not([type=hidden]),select,textarea,*[tabindex]`;
	if (matches(element, focusableSelector)) return element;
	return element.querySelector(focusableSelector);
}
function focusFirstFocusableNode(element, onlyDescendants = true) {
	findFirstFocusableNode(element, onlyDescendants)?.focus();
}
function focusNextFocusableNode(node, filter) {
	const nextFocusable = nextFocusableNode(node, filter);
	if (nextFocusable && nextFocusable instanceof HTMLElement) {
		nextFocusable.focus();
		return true;
	}
	return false;
}
function findFirstKeyboardFocusableNode(element, onlyDescendants = true) {
	if (!onlyDescendants && matches(element, KEYBOARD_FOCUSABLE_SELECTORS)) return element;
	return element.querySelector(KEYBOARD_FOCUSABLE_SELECTORS);
}
function focusFirstKeyboardFocusableNode(element, onlyDescendants = true) {
	const firstFocusable = findFirstKeyboardFocusableNode(element, onlyDescendants);
	if (firstFocusable) {
		firstFocusable.focus();
		return true;
	}
	return false;
}
function findLastKeyboardFocusableNode(element, onlyDescendants = true) {
	if (!onlyDescendants && matches(element, KEYBOARD_FOCUSABLE_SELECTORS)) return element;
	const allFocusable = element.querySelectorAll(KEYBOARD_FOCUSABLE_SELECTORS);
	return allFocusable[allFocusable.length - 1];
}
function focusLastKeyboardFocusableNode(element, onlyDescendants = true) {
	const lastFocusable = findLastKeyboardFocusableNode(element, onlyDescendants);
	if (lastFocusable) {
		lastFocusable.focus();
		return true;
	}
	return false;
}
function wrapFocusPreviousFocusableMenuItem(parentElement, currentFocusedElement) {
	const allFocusableChildren = getMenuFocusableDescendants(parentElement);
	const currentItemIdx = getCurrentFocusedElementIndex(allFocusableChildren, currentFocusedElement);
	if (currentItemIdx === -1) allFocusableChildren[0].focus();
	else allFocusableChildren[(currentItemIdx - 1 + allFocusableChildren.length) % allFocusableChildren.length].focus();
}
function wrapFocusNextFocusableMenuItem(parentElement, currentFocusedElement) {
	const allFocusableChildren = getMenuFocusableDescendants(parentElement);
	const currentItemIdx = getCurrentFocusedElementIndex(allFocusableChildren, currentFocusedElement);
	if (currentItemIdx === -1) allFocusableChildren[0].focus();
	else allFocusableChildren[(currentItemIdx + 1) % allFocusableChildren.length].focus();
}
function getMenuFocusableDescendants(element) {
	return element.querySelectorAll(MENUITEM_FOCUSABLE_SELECTORS);
}
function getCurrentFocusedElementIndex(allFocusableChildren, currentFocusedElement) {
	let currentItemIdx = 0;
	for (const focusableChild of allFocusableChildren) {
		if (focusableChild === currentFocusedElement) break;
		currentItemIdx++;
	}
	return currentItemIdx === allFocusableChildren.length ? -1 : currentItemIdx;
}
function matches(node, selector) {
	if (node.matches) return node.matches(selector);
	const matches = (node.ownerDocument || document).querySelectorAll(selector);
	let i = matches.length;
	while (--i >= 0 && matches.item(i) !== node) return i > -1;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Button/Button.css.js
var styles$69 = {
	"Button": "Polaris-Button",
	"disabled": "Polaris-Button--disabled",
	"pressed": "Polaris-Button--pressed",
	"variantPrimary": "Polaris-Button--variantPrimary",
	"variantSecondary": "Polaris-Button--variantSecondary",
	"variantTertiary": "Polaris-Button--variantTertiary",
	"variantPlain": "Polaris-Button--variantPlain",
	"removeUnderline": "Polaris-Button--removeUnderline",
	"variantMonochromePlain": "Polaris-Button--variantMonochromePlain",
	"toneSuccess": "Polaris-Button--toneSuccess",
	"toneCritical": "Polaris-Button--toneCritical",
	"sizeMicro": "Polaris-Button--sizeMicro",
	"sizeSlim": "Polaris-Button--sizeSlim",
	"sizeMedium": "Polaris-Button--sizeMedium",
	"sizeLarge": "Polaris-Button--sizeLarge",
	"textAlignCenter": "Polaris-Button--textAlignCenter",
	"textAlignStart": "Polaris-Button--textAlignStart",
	"textAlignLeft": "Polaris-Button--textAlignLeft",
	"textAlignEnd": "Polaris-Button--textAlignEnd",
	"textAlignRight": "Polaris-Button--textAlignRight",
	"fullWidth": "Polaris-Button--fullWidth",
	"iconOnly": "Polaris-Button--iconOnly",
	"iconWithText": "Polaris-Button--iconWithText",
	"disclosure": "Polaris-Button--disclosure",
	"loading": "Polaris-Button--loading",
	"pressable": "Polaris-Button--pressable",
	"hidden": "Polaris-Button--hidden",
	"Icon": "Polaris-Button__Icon",
	"Spinner": "Polaris-Button__Spinner"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Icon/Icon.css.js
var styles$68 = {
	"Icon": "Polaris-Icon",
	"toneInherit": "Polaris-Icon--toneInherit",
	"toneBase": "Polaris-Icon--toneBase",
	"toneSubdued": "Polaris-Icon--toneSubdued",
	"toneCaution": "Polaris-Icon--toneCaution",
	"toneWarning": "Polaris-Icon--toneWarning",
	"toneCritical": "Polaris-Icon--toneCritical",
	"toneInteractive": "Polaris-Icon--toneInteractive",
	"toneInfo": "Polaris-Icon--toneInfo",
	"toneSuccess": "Polaris-Icon--toneSuccess",
	"tonePrimary": "Polaris-Icon--tonePrimary",
	"toneEmphasis": "Polaris-Icon--toneEmphasis",
	"toneMagic": "Polaris-Icon--toneMagic",
	"toneTextCaution": "Polaris-Icon--toneTextCaution",
	"toneTextWarning": "Polaris-Icon--toneTextWarning",
	"toneTextCritical": "Polaris-Icon--toneTextCritical",
	"toneTextInfo": "Polaris-Icon--toneTextInfo",
	"toneTextPrimary": "Polaris-Icon--toneTextPrimary",
	"toneTextSuccess": "Polaris-Icon--toneTextSuccess",
	"toneTextMagic": "Polaris-Icon--toneTextMagic",
	"Svg": "Polaris-Icon__Svg",
	"Img": "Polaris-Icon__Img",
	"Placeholder": "Polaris-Icon__Placeholder"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Text/Text.css.js
var styles$67 = {
	"root": "Polaris-Text--root",
	"block": "Polaris-Text--block",
	"truncate": "Polaris-Text--truncate",
	"visuallyHidden": "Polaris-Text--visuallyHidden",
	"start": "Polaris-Text--start",
	"center": "Polaris-Text--center",
	"end": "Polaris-Text--end",
	"justify": "Polaris-Text--justify",
	"base": "Polaris-Text--base",
	"inherit": "Polaris-Text--inherit",
	"disabled": "Polaris-Text--disabled",
	"success": "Polaris-Text--success",
	"critical": "Polaris-Text--critical",
	"caution": "Polaris-Text--caution",
	"subdued": "Polaris-Text--subdued",
	"magic": "Polaris-Text--magic",
	"magic-subdued": "Polaris-Text__magic--subdued",
	"text-inverse": "Polaris-Text__text--inverse",
	"text-inverse-secondary": "Polaris-Text--textInverseSecondary",
	"headingXs": "Polaris-Text--headingXs",
	"headingSm": "Polaris-Text--headingSm",
	"headingMd": "Polaris-Text--headingMd",
	"headingLg": "Polaris-Text--headingLg",
	"headingXl": "Polaris-Text--headingXl",
	"heading2xl": "Polaris-Text--heading2xl",
	"heading3xl": "Polaris-Text--heading3xl",
	"bodyXs": "Polaris-Text--bodyXs",
	"bodySm": "Polaris-Text--bodySm",
	"bodyMd": "Polaris-Text--bodyMd",
	"bodyLg": "Polaris-Text--bodyLg",
	"regular": "Polaris-Text--regular",
	"medium": "Polaris-Text--medium",
	"semibold": "Polaris-Text--semibold",
	"bold": "Polaris-Text--bold",
	"break": "Polaris-Text--break",
	"numeric": "Polaris-Text--numeric",
	"line-through": "Polaris-Text__line--through"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Text/Text.js
var deprecatedVariants = { heading3xl: "heading2xl" };
var Text = ({ alignment, as, breakWord, children, tone, fontWeight, id, numeric = false, truncate = false, variant, visuallyHidden = false, textDecorationLine }) => {
	if (process.env.NODE_ENV === "development" && variant && Object.prototype.hasOwnProperty.call(deprecatedVariants, variant)) console.warn(`Deprecation: <Text variant="${variant}" />. The value "${variant}" will be removed in a future major version of Polaris. Use "${deprecatedVariants[variant]}" instead.`);
	const Component = as || (visuallyHidden ? "span" : "p");
	const className = classNames(styles$67.root, variant && styles$67[variant], fontWeight && styles$67[fontWeight], (alignment || truncate) && styles$67.block, alignment && styles$67[alignment], breakWord && styles$67.break, tone && styles$67[tone], numeric && styles$67.numeric, truncate && styles$67.truncate, visuallyHidden && styles$67.visuallyHidden, textDecorationLine && styles$67[textDecorationLine]);
	return /* @__PURE__ */ React.createElement(Component, Object.assign({ className }, id && { id }), children);
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Icon/Icon.js
function Icon({ source, tone, accessibilityLabel }) {
	let sourceType;
	if (typeof source === "function") sourceType = "function";
	else if (source === "placeholder") sourceType = "placeholder";
	else sourceType = "external";
	if (tone && sourceType === "external" && process.env.NODE_ENV === "development") console.warn("Recoloring external SVGs is not supported. Set the intended color on your SVG instead.");
	const className = classNames(styles$68.Icon, tone && styles$68[variationName("tone", tone)]);
	const { mdDown } = useBreakpoints();
	const SourceComponent = source;
	const contentMarkup = {
		function: /* @__PURE__ */ React.createElement(SourceComponent, Object.assign({
			className: styles$68.Svg,
			focusable: "false",
			"aria-hidden": "true"
		}, mdDown ? { viewBox: "1 1 18 18" } : {})),
		placeholder: /* @__PURE__ */ React.createElement("div", { className: styles$68.Placeholder }),
		external: /* @__PURE__ */ React.createElement("img", {
			className: styles$68.Img,
			src: `data:image/svg+xml;utf8,${source}`,
			alt: "",
			"aria-hidden": "true"
		})
	};
	return /* @__PURE__ */ React.createElement("span", { className }, accessibilityLabel && /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		visuallyHidden: true
	}, accessibilityLabel), contentMarkup[sourceType]);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Spinner/Spinner.css.js
var styles$66 = {
	"Spinner": "Polaris-Spinner",
	"sizeSmall": "Polaris-Spinner--sizeSmall",
	"sizeLarge": "Polaris-Spinner--sizeLarge"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Spinner/Spinner.js
function Spinner$1({ size = "large", accessibilityLabel, hasFocusableParent }) {
	const isAfterInitialMount = useIsAfterInitialMount();
	const className = classNames(styles$66.Spinner, size && styles$66[variationName("size", size)]);
	const spinnerSVGMarkup = size === "large" ? /* @__PURE__ */ React.createElement("svg", {
		viewBox: "0 0 44 44",
		xmlns: "http://www.w3.org/2000/svg"
	}, /* @__PURE__ */ React.createElement("path", { d: "M15.542 1.487A21.507 21.507 0 00.5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 00-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 10-.9-2.863z" })) : /* @__PURE__ */ React.createElement("svg", {
		viewBox: "0 0 20 20",
		xmlns: "http://www.w3.org/2000/svg"
	}, /* @__PURE__ */ React.createElement("path", { d: "M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z" }));
	const spanAttributes = { ...!hasFocusableParent && { role: "status" } };
	const accessibilityLabelMarkup = (isAfterInitialMount || !hasFocusableParent) && /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		visuallyHidden: true
	}, accessibilityLabel);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className }, spinnerSVGMarkup), /* @__PURE__ */ React.createElement("span", spanAttributes, accessibilityLabelMarkup));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-disable-interaction.js
/**
* useDisableInteraction provides the original event handler but disables interaction
* if the boolean passed is true.
* @param disabled - A boolean value that determines if the button should
* be disabled
* @param handleEvent - The original event handler
* @returns Function - The original event handler but with interactions disabled if the
* provided boolean is true
* @example
* function ComponentExample() {
* const handleClick = () => {
*  console.log('disable me');
* };
* const handleClickEvent = useDisableInteraction(true, handleClick);
* return <button onClick={handleClickEvent}>Im Disabled</button>;
* }
*/
function useDisableClick(disabled, handleClick) {
	const handleClickWrapper = useCallback((event) => {
		if (disabled) {
			event.preventDefault();
			event.stopPropagation();
		}
	}, [disabled]);
	if (!disabled) return handleClick;
	return handleClickWrapper;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/link/hooks.js
function useLink() {
	return useContext(LinkContext);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/UnstyledLink/UnstyledLink.js
var UnstyledLink = /* @__PURE__ */ memo(/* @__PURE__ */ forwardRef(function UnstyledLink(props, _ref) {
	const LinkComponent = useLink();
	if (LinkComponent) return /* @__PURE__ */ React.createElement(LinkComponent, Object.assign({}, unstyled.props, props, { ref: _ref }));
	const { external, url, target: targetProp, ...rest } = props;
	let target;
	if (external) target = "_blank";
	else target = targetProp ?? void 0;
	const rel = target === "_blank" ? "noopener noreferrer" : void 0;
	return /* @__PURE__ */ React.createElement("a", Object.assign({ target }, rest, {
		href: url,
		rel
	}, unstyled.props, { ref: _ref }));
}));
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/UnstyledButton/UnstyledButton.js
function UnstyledButton({ id, children, className, url, external, target, download, submit, disabled, loading, pressed, accessibilityLabel, role, ariaControls, ariaExpanded, ariaDescribedBy, ariaChecked, onClick, onFocus, onBlur, onKeyDown, onKeyPress, onKeyUp, onMouseEnter, onTouchStart, ...rest }) {
	let buttonMarkup;
	const commonProps = {
		id,
		className,
		"aria-label": accessibilityLabel
	};
	const interactiveProps = {
		...commonProps,
		role,
		onClick,
		onFocus,
		onBlur,
		onMouseUp: handleMouseUpByBlurring,
		onMouseEnter,
		onTouchStart
	};
	const handleClick = useDisableClick(disabled, onClick);
	if (url) buttonMarkup = disabled ? /* @__PURE__ */ React.createElement("a", commonProps, children) : /* @__PURE__ */ React.createElement(UnstyledLink, Object.assign({}, interactiveProps, {
		url,
		external,
		target,
		download
	}, rest), children);
	else buttonMarkup = /* @__PURE__ */ React.createElement("button", Object.assign({}, interactiveProps, {
		"aria-disabled": disabled,
		type: submit ? "submit" : "button",
		"aria-busy": loading ? true : void 0,
		"aria-controls": ariaControls,
		"aria-expanded": ariaExpanded,
		"aria-describedby": ariaDescribedBy,
		"aria-checked": ariaChecked,
		"aria-pressed": pressed,
		onKeyDown,
		onKeyUp,
		onKeyPress,
		onClick: handleClick,
		tabIndex: disabled ? -1 : void 0
	}, rest), children);
	return buttonMarkup;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/errors.js
var MissingAppProviderError = class extends Error {
	constructor(message = "") {
		super(`${message ? `${message} ` : message}Your application must be wrapped in an <AppProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.`);
		this.name = "MissingAppProviderError";
	}
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/i18n/hooks.js
function useI18n() {
	const i18n = useContext(I18nContext);
	if (!i18n) throw new MissingAppProviderError("No i18n was provided.");
	return i18n;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Button/Button.js
function Button({ id, children, url, disabled, external, download, target, submit, loading, pressed, accessibilityLabel, role, ariaControls, ariaExpanded, ariaDescribedBy, ariaChecked, onClick, onFocus, onBlur, onKeyDown, onKeyPress, onKeyUp, onMouseEnter, onTouchStart, onPointerDown, icon, disclosure, removeUnderline, size = "medium", textAlign = "center", fullWidth, dataPrimaryLink, tone, variant = "secondary" }) {
	const i18n = useI18n();
	const isDisabled = disabled || loading;
	const { mdUp } = useBreakpoints();
	const className = classNames(styles$69.Button, styles$69.pressable, styles$69[variationName("variant", variant)], styles$69[variationName("size", size)], styles$69[variationName("textAlign", textAlign)], fullWidth && styles$69.fullWidth, disclosure && styles$69.disclosure, icon && children && styles$69.iconWithText, icon && children == null && styles$69.iconOnly, isDisabled && styles$69.disabled, loading && styles$69.loading, pressed && !disabled && !url && styles$69.pressed, removeUnderline && styles$69.removeUnderline, tone && styles$69[variationName("tone", tone)]);
	const disclosureMarkup = disclosure ? /* @__PURE__ */ React.createElement("span", { className: loading ? styles$69.hidden : styles$69.Icon }, /* @__PURE__ */ React.createElement(Icon, { source: loading ? "placeholder" : getDisclosureIconSource(disclosure, SvgChevronUpIcon, SvgChevronDownIcon) })) : null;
	const iconSource = isIconSource(icon) ? /* @__PURE__ */ React.createElement(Icon, { source: loading ? "placeholder" : icon }) : icon;
	const iconMarkup = iconSource ? /* @__PURE__ */ React.createElement("span", { className: loading ? styles$69.hidden : styles$69.Icon }, iconSource) : null;
	const hasPlainText = ["plain", "monochromePlain"].includes(variant);
	let textFontWeight = "medium";
	if (hasPlainText) textFontWeight = "regular";
	else if (variant === "primary") textFontWeight = mdUp ? "medium" : "semibold";
	let textVariant = "bodySm";
	if (size === "large" || hasPlainText && size !== "micro") textVariant = "bodyMd";
	const childMarkup = children ? /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: textVariant,
		fontWeight: textFontWeight,
		key: disabled ? "text-disabled" : "text"
	}, children) : null;
	const spinnerSVGMarkup = loading ? /* @__PURE__ */ React.createElement("span", { className: styles$69.Spinner }, /* @__PURE__ */ React.createElement(Spinner$1, {
		size: "small",
		accessibilityLabel: i18n.translate("Polaris.Button.spinnerAccessibilityLabel")
	})) : null;
	const commonProps = {
		id,
		className,
		accessibilityLabel,
		ariaDescribedBy,
		role,
		onClick,
		onFocus,
		onBlur,
		onMouseUp: handleMouseUpByBlurring,
		onMouseEnter,
		onTouchStart,
		"data-primary-link": dataPrimaryLink
	};
	const linkProps = {
		url,
		external,
		download,
		target
	};
	const actionProps = {
		submit,
		disabled: isDisabled,
		loading,
		ariaControls,
		ariaExpanded,
		ariaChecked,
		pressed,
		onKeyDown,
		onKeyUp,
		onKeyPress,
		onPointerDown
	};
	return /* @__PURE__ */ React.createElement(UnstyledButton, Object.assign({}, commonProps, linkProps, actionProps), spinnerSVGMarkup, iconMarkup, childMarkup, disclosureMarkup);
}
function isIconSource(x) {
	return typeof x === "string" || typeof x === "object" && x.body || typeof x === "function";
}
function getDisclosureIconSource(disclosure, upIcon, downIcon) {
	if (disclosure === "select") return SvgSelectIcon;
	return disclosure === "up" ? upIcon : downIcon;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Button/utils.js
function buttonsFrom(actions, overrides = {}) {
	if (Array.isArray(actions)) return actions.map((action, index) => buttonFrom(action, overrides, index));
	else return buttonFrom(actions, overrides);
}
function buttonFrom({ content, onAction, plain, destructive, ...action }, overrides, key) {
	const plainVariant = plain ? "plain" : void 0;
	const destructiveVariant = destructive ? "primary" : void 0;
	const tone = !overrides?.tone && destructive ? "critical" : overrides?.tone;
	return /* @__PURE__ */ React.createElement(Button, Object.assign({
		key,
		onClick: onAction,
		tone,
		variant: plainVariant || destructiveVariant
	}, action, overrides), content);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ShadowBevel/ShadowBevel.css.js
var styles$65 = { "ShadowBevel": "Polaris-ShadowBevel" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ShadowBevel/ShadowBevel.js
function ShadowBevel(props) {
	const { as = "div", bevel = true, borderRadius, boxShadow, children, zIndex = "0" } = props;
	const Component = as;
	return /* @__PURE__ */ React.createElement(Component, {
		className: styles$65.ShadowBevel,
		style: {
			"--pc-shadow-bevel-z-index": zIndex,
			...getResponsiveValue("shadow-bevel", "content", mapResponsiveProp(bevel, (bevel) => bevel ? "\"\"" : "none")),
			...getResponsiveValue("shadow-bevel", "box-shadow", mapResponsiveProp(bevel, (bevel) => bevel ? `var(--p-shadow-${boxShadow})` : "none")),
			...getResponsiveValue("shadow-bevel", "border-radius", mapResponsiveProp(bevel, (bevel) => bevel ? `var(--p-border-radius-${borderRadius})` : "var(--p-border-radius-0)"))
		}
	}, children);
}
function mapResponsiveProp(responsiveProp, callback) {
	if (typeof responsiveProp === "boolean") return callback(responsiveProp);
	return Object.fromEntries(Object.entries(responsiveProp).map(([breakpointsAlias, value]) => [breakpointsAlias, callback(value)]));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Box/Box.css.js
var styles$64 = {
	"listReset": "Polaris-Box--listReset",
	"Box": "Polaris-Box",
	"visuallyHidden": "Polaris-Box--visuallyHidden",
	"printHidden": "Polaris-Box--printHidden"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Box/Box.js
var Box = /* @__PURE__ */ forwardRef(({ as = "div", background, borderColor, borderStyle, borderWidth, borderBlockStartWidth, borderBlockEndWidth, borderInlineStartWidth, borderInlineEndWidth, borderRadius, borderEndStartRadius, borderEndEndRadius, borderStartStartRadius, borderStartEndRadius, children, color, id, minHeight, minWidth, maxWidth, overflowX, overflowY, outlineColor, outlineStyle, outlineWidth, padding, paddingBlock, paddingBlockStart, paddingBlockEnd, paddingInline, paddingInlineStart, paddingInlineEnd, role, shadow, tabIndex, width, printHidden, visuallyHidden, position, insetBlockStart, insetBlockEnd, insetInlineStart, insetInlineEnd, zIndex, opacity, ...restProps }, ref) => {
	const borderStyleValue = borderStyle ? borderStyle : borderColor || borderWidth || borderBlockStartWidth || borderBlockEndWidth || borderInlineStartWidth || borderInlineEndWidth ? "solid" : void 0;
	const outlineStyleValue = outlineStyle ? outlineStyle : outlineColor || outlineWidth ? "solid" : void 0;
	const style = {
		"--pc-box-color": color ? `var(--p-color-${color})` : void 0,
		"--pc-box-background": background ? `var(--p-color-${background})` : void 0,
		"--pc-box-border-color": borderColor ? borderColor === "transparent" ? "transparent" : `var(--p-color-${borderColor})` : void 0,
		"--pc-box-border-style": borderStyleValue,
		"--pc-box-border-radius": borderRadius ? `var(--p-border-radius-${borderRadius})` : void 0,
		"--pc-box-border-end-start-radius": borderEndStartRadius ? `var(--p-border-radius-${borderEndStartRadius})` : void 0,
		"--pc-box-border-end-end-radius": borderEndEndRadius ? `var(--p-border-radius-${borderEndEndRadius})` : void 0,
		"--pc-box-border-start-start-radius": borderStartStartRadius ? `var(--p-border-radius-${borderStartStartRadius})` : void 0,
		"--pc-box-border-start-end-radius": borderStartEndRadius ? `var(--p-border-radius-${borderStartEndRadius})` : void 0,
		"--pc-box-border-width": borderWidth ? `var(--p-border-width-${borderWidth})` : void 0,
		"--pc-box-border-block-start-width": borderBlockStartWidth ? `var(--p-border-width-${borderBlockStartWidth})` : void 0,
		"--pc-box-border-block-end-width": borderBlockEndWidth ? `var(--p-border-width-${borderBlockEndWidth})` : void 0,
		"--pc-box-border-inline-start-width": borderInlineStartWidth ? `var(--p-border-width-${borderInlineStartWidth})` : void 0,
		"--pc-box-border-inline-end-width": borderInlineEndWidth ? `var(--p-border-width-${borderInlineEndWidth})` : void 0,
		"--pc-box-min-height": minHeight,
		"--pc-box-min-width": minWidth,
		"--pc-box-max-width": maxWidth,
		"--pc-box-outline-color": outlineColor ? `var(--p-color-${outlineColor})` : void 0,
		"--pc-box-outline-style": outlineStyleValue,
		"--pc-box-outline-width": outlineWidth ? `var(--p-border-width-${outlineWidth})` : void 0,
		"--pc-box-overflow-x": overflowX,
		"--pc-box-overflow-y": overflowY,
		...getResponsiveProps("box", "padding-block-start", "space", paddingBlockStart || paddingBlock || padding),
		...getResponsiveProps("box", "padding-block-end", "space", paddingBlockEnd || paddingBlock || padding),
		...getResponsiveProps("box", "padding-inline-start", "space", paddingInlineStart || paddingInline || padding),
		...getResponsiveProps("box", "padding-inline-end", "space", paddingInlineEnd || paddingInline || padding),
		"--pc-box-shadow": shadow ? `var(--p-shadow-${shadow})` : void 0,
		"--pc-box-width": width,
		position,
		"--pc-box-inset-block-start": insetBlockStart ? `var(--p-space-${insetBlockStart})` : void 0,
		"--pc-box-inset-block-end": insetBlockEnd ? `var(--p-space-${insetBlockEnd})` : void 0,
		"--pc-box-inset-inline-start": insetInlineStart ? `var(--p-space-${insetInlineStart})` : void 0,
		"--pc-box-inset-inline-end": insetInlineEnd ? `var(--p-space-${insetInlineEnd})` : void 0,
		zIndex,
		opacity
	};
	const className = classNames(styles$64.Box, visuallyHidden && styles$64.visuallyHidden, printHidden && styles$64.printHidden, as === "ul" && styles$64.listReset);
	return /* @__PURE__ */ React.createElement(as, {
		className,
		id,
		ref,
		style: sanitizeCustomProperties(style),
		role,
		tabIndex,
		...restProps
	}, children);
});
Box.displayName = "Box";
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Card/Card.js
var Card = ({ children, background = "bg-surface", padding = { xs: "400" }, roundedAbove = "sm" }) => {
	const breakpoints = useBreakpoints();
	const defaultBorderRadius = "300";
	const hasBorderRadius = Boolean(breakpoints[`${roundedAbove}Up`]);
	return /* @__PURE__ */ React.createElement(WithinContentContext.Provider, { value: true }, /* @__PURE__ */ React.createElement(ShadowBevel, {
		boxShadow: "100",
		borderRadius: hasBorderRadius ? defaultBorderRadius : "0",
		zIndex: "32"
	}, /* @__PURE__ */ React.createElement(Box, {
		background,
		padding,
		overflowX: "clip",
		overflowY: "clip",
		minHeight: "100%"
	}, children)));
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/InlineStack/InlineStack.css.js
var styles$63 = { "InlineStack": "Polaris-InlineStack" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/InlineStack/InlineStack.js
var InlineStack = function InlineStack({ as: Element = "div", align, direction = "row", blockAlign, gap, wrap = true, children }) {
	const style = {
		"--pc-inline-stack-align": align,
		"--pc-inline-stack-block-align": blockAlign,
		"--pc-inline-stack-wrap": wrap ? "wrap" : "nowrap",
		...getResponsiveProps("inline-stack", "gap", "space", gap),
		...getResponsiveValue("inline-stack", "flex-direction", direction)
	};
	return /* @__PURE__ */ React.createElement(Element, {
		className: styles$63.InlineStack,
		style
	}, children);
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/BlockStack/BlockStack.css.js
var styles$62 = {
	"BlockStack": "Polaris-BlockStack",
	"listReset": "Polaris-BlockStack--listReset",
	"fieldsetReset": "Polaris-BlockStack--fieldsetReset"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/BlockStack/BlockStack.js
var BlockStack = ({ as = "div", children, align, inlineAlign, gap, id, reverseOrder = false, ...restProps }) => {
	const className = classNames(styles$62.BlockStack, (as === "ul" || as === "ol") && styles$62.listReset, as === "fieldset" && styles$62.fieldsetReset);
	const style = {
		"--pc-block-stack-align": align ? `${align}` : null,
		"--pc-block-stack-inline-align": inlineAlign ? `${inlineAlign}` : null,
		"--pc-block-stack-order": reverseOrder ? "column-reverse" : "column",
		...getResponsiveProps("block-stack", "gap", "space", gap)
	};
	return /* @__PURE__ */ React.createElement(as, {
		className,
		id,
		style: sanitizeCustomProperties(style),
		...restProps
	}, children);
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Image/Image.js
var Image = /* @__PURE__ */ forwardRef(({ alt, sourceSet, source, crossOrigin, onLoad, className, ...rest }, ref) => {
	const finalSourceSet = sourceSet ? sourceSet.map(({ source: subSource, descriptor }) => `${subSource} ${descriptor}`).join(",") : null;
	const handleLoad = useCallback(() => {
		if (onLoad) onLoad();
	}, [onLoad]);
	return /* @__PURE__ */ React.createElement("img", Object.assign({
		ref,
		alt,
		src: source,
		crossOrigin,
		className,
		onLoad: handleLoad
	}, finalSourceSet ? { srcSet: finalSourceSet } : {}, rest));
});
Image.displayName = "Image";
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/FilterActionsProvider/FilterActionsProvider.js
var FilterActionsContext = /* @__PURE__ */ createContext(false);
function FilterActionsProvider({ children, filterActions }) {
	return /* @__PURE__ */ React.createElement(FilterActionsContext.Provider, { value: filterActions }, children);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionList/ActionList.css.js
var styles$61 = {
	"Item": "Polaris-ActionList__Item",
	"default": "Polaris-ActionList--default",
	"active": "Polaris-ActionList--active",
	"destructive": "Polaris-ActionList--destructive",
	"disabled": "Polaris-ActionList--disabled",
	"Prefix": "Polaris-ActionList__Prefix",
	"Suffix": "Polaris-ActionList__Suffix",
	"indented": "Polaris-ActionList--indented",
	"menu": "Polaris-ActionList--menu",
	"Text": "Polaris-ActionList__Text"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/within-filter-context.js
var WithinFilterContext = /* @__PURE__ */ createContext(false);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Badge/Badge.css.js
var styles$60 = {
	"Badge": "Polaris-Badge",
	"toneSuccess": "Polaris-Badge--toneSuccess",
	"toneSuccess-strong": "Polaris-Badge__toneSuccess--strong",
	"toneInfo": "Polaris-Badge--toneInfo",
	"toneInfo-strong": "Polaris-Badge__toneInfo--strong",
	"toneAttention": "Polaris-Badge--toneAttention",
	"toneAttention-strong": "Polaris-Badge__toneAttention--strong",
	"toneWarning": "Polaris-Badge--toneWarning",
	"toneWarning-strong": "Polaris-Badge__toneWarning--strong",
	"toneCritical": "Polaris-Badge--toneCritical",
	"toneCritical-strong": "Polaris-Badge__toneCritical--strong",
	"toneNew": "Polaris-Badge--toneNew",
	"toneMagic": "Polaris-Badge--toneMagic",
	"toneRead-only": "Polaris-Badge__toneRead--only",
	"toneEnabled": "Polaris-Badge--toneEnabled",
	"sizeLarge": "Polaris-Badge--sizeLarge",
	"withinFilter": "Polaris-Badge--withinFilter",
	"Icon": "Polaris-Badge__Icon",
	"PipContainer": "Polaris-Badge__PipContainer"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Badge/types.js
var ToneValue = /* @__PURE__ */ function(ToneValue) {
	ToneValue["Info"] = "info";
	ToneValue["Success"] = "success";
	ToneValue["Warning"] = "warning";
	ToneValue["Critical"] = "critical";
	ToneValue["Attention"] = "attention";
	ToneValue["New"] = "new";
	ToneValue["Magic"] = "magic";
	ToneValue["InfoStrong"] = "info-strong";
	ToneValue["SuccessStrong"] = "success-strong";
	ToneValue["WarningStrong"] = "warning-strong";
	ToneValue["CriticalStrong"] = "critical-strong";
	ToneValue["AttentionStrong"] = "attention-strong";
	ToneValue["ReadOnly"] = "read-only";
	ToneValue["Enabled"] = "enabled";
	return ToneValue;
}({});
var ProgressValue = /* @__PURE__ */ function(ProgressValue) {
	ProgressValue["Incomplete"] = "incomplete";
	ProgressValue["PartiallyComplete"] = "partiallyComplete";
	ProgressValue["Complete"] = "complete";
	return ProgressValue;
}({});
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Badge/utils.js
function getDefaultAccessibilityLabel(i18n, progress, tone) {
	let progressLabel = "";
	let toneLabel = "";
	if (!progress && !tone) return "";
	switch (progress) {
		case ProgressValue.Incomplete:
			progressLabel = i18n.translate("Polaris.Badge.PROGRESS_LABELS.incomplete");
			break;
		case ProgressValue.PartiallyComplete:
			progressLabel = i18n.translate("Polaris.Badge.PROGRESS_LABELS.partiallyComplete");
			break;
		case ProgressValue.Complete:
			progressLabel = i18n.translate("Polaris.Badge.PROGRESS_LABELS.complete");
			break;
	}
	switch (tone) {
		case ToneValue.Info:
		case ToneValue.InfoStrong:
			toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.info");
			break;
		case ToneValue.Success:
		case ToneValue.SuccessStrong:
			toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.success");
			break;
		case ToneValue.Warning:
		case ToneValue.WarningStrong:
			toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.warning");
			break;
		case ToneValue.Critical:
		case ToneValue.CriticalStrong:
			toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.critical");
			break;
		case ToneValue.Attention:
		case ToneValue.AttentionStrong:
			toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.attention");
			break;
		case ToneValue.New:
			toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.new");
			break;
		case ToneValue.ReadOnly:
			toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.readOnly");
			break;
		case ToneValue.Enabled:
			toneLabel = i18n.translate("Polaris.Badge.TONE_LABELS.enabled");
			break;
	}
	if (!tone && progress) return progressLabel;
	else if (tone && !progress) return toneLabel;
	else return i18n.translate("Polaris.Badge.progressAndTone", {
		progressLabel,
		toneLabel
	});
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Badge/components/Pip/Pip.css.js
var styles$59 = {
	"Pip": "Polaris-Badge-Pip",
	"toneInfo": "Polaris-Badge-Pip--toneInfo",
	"toneSuccess": "Polaris-Badge-Pip--toneSuccess",
	"toneNew": "Polaris-Badge-Pip--toneNew",
	"toneAttention": "Polaris-Badge-Pip--toneAttention",
	"toneWarning": "Polaris-Badge-Pip--toneWarning",
	"toneCritical": "Polaris-Badge-Pip--toneCritical",
	"progressIncomplete": "Polaris-Badge-Pip--progressIncomplete",
	"progressPartiallyComplete": "Polaris-Badge-Pip--progressPartiallyComplete",
	"progressComplete": "Polaris-Badge-Pip--progressComplete"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Badge/components/Pip/Pip.js
function Pip({ tone, progress = "complete", accessibilityLabelOverride }) {
	const i18n = useI18n();
	const className = classNames(styles$59.Pip, tone && styles$59[variationName("tone", tone)], progress && styles$59[variationName("progress", progress)]);
	const accessibilityLabel = accessibilityLabelOverride ? accessibilityLabelOverride : getDefaultAccessibilityLabel(i18n, progress, tone);
	return /* @__PURE__ */ React.createElement("span", { className }, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		visuallyHidden: true
	}, accessibilityLabel));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Badge/Badge.js
var DEFAULT_SIZE = "medium";
var progressIconMap = {
	complete: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 20 20" }, /* @__PURE__ */ React.createElement("path", { d: "M6 10c0-.93 0-1.395.102-1.776a3 3 0 0 1 2.121-2.122C8.605 6 9.07 6 10 6c.93 0 1.395 0 1.776.102a3 3 0 0 1 2.122 2.122C14 8.605 14 9.07 14 10s0 1.395-.102 1.777a3 3 0 0 1-2.122 2.12C11.395 14 10.93 14 10 14s-1.395 0-1.777-.102a3 3 0 0 1-2.12-2.121C6 11.395 6 10.93 6 10Z" })),
	partiallyComplete: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 20 20" }, /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "m8.888 6.014-.017-.018-.02.02c-.253.013-.45.038-.628.086a3 3 0 0 0-2.12 2.122C6 8.605 6 9.07 6 10s0 1.395.102 1.777a3 3 0 0 0 2.121 2.12C8.605 14 9.07 14 10 14c.93 0 1.395 0 1.776-.102a3 3 0 0 0 2.122-2.121C14 11.395 14 10.93 14 10c0-.93 0-1.395-.102-1.776a3 3 0 0 0-2.122-2.122C11.395 6 10.93 6 10 6c-.475 0-.829 0-1.112.014ZM8.446 7.34a1.75 1.75 0 0 0-1.041.94l4.314 4.315c.443-.2.786-.576.941-1.042L8.446 7.34Zm4.304 2.536L10.124 7.25c.908.001 1.154.013 1.329.06a1.75 1.75 0 0 1 1.237 1.237c.047.175.059.42.06 1.329ZM8.547 12.69c.182.05.442.06 1.453.06h.106L7.25 9.894V10c0 1.01.01 1.27.06 1.453a1.75 1.75 0 0 0 1.237 1.237Z"
	})),
	incomplete: () => /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 20 20" }, /* @__PURE__ */ React.createElement("path", {
		fillRule: "evenodd",
		d: "M8.547 12.69c.183.05.443.06 1.453.06s1.27-.01 1.453-.06a1.75 1.75 0 0 0 1.237-1.237c.05-.182.06-.443.06-1.453s-.01-1.27-.06-1.453a1.75 1.75 0 0 0-1.237-1.237c-.182-.05-.443-.06-1.453-.06s-1.27.01-1.453.06A1.75 1.75 0 0 0 7.31 8.547c-.05.183-.06.443-.06 1.453s.01 1.27.06 1.453a1.75 1.75 0 0 0 1.237 1.237ZM6.102 8.224C6 8.605 6 9.07 6 10s0 1.395.102 1.777a3 3 0 0 0 2.122 2.12C8.605 14 9.07 14 10 14s1.395 0 1.777-.102a3 3 0 0 0 2.12-2.121C14 11.395 14 10.93 14 10c0-.93 0-1.395-.102-1.776a3 3 0 0 0-2.121-2.122C11.395 6 10.93 6 10 6c-.93 0-1.395 0-1.776.102a3 3 0 0 0-2.122 2.122Z"
	}))
};
function Badge({ children, tone, progress, icon, size = DEFAULT_SIZE, toneAndProgressLabelOverride }) {
	const i18n = useI18n();
	const withinFilter = useContext(WithinFilterContext);
	const className = classNames(styles$60.Badge, tone && styles$60[variationName("tone", tone)], size && size !== DEFAULT_SIZE && styles$60[variationName("size", size)], withinFilter && styles$60.withinFilter);
	const accessibilityLabel = toneAndProgressLabelOverride ? toneAndProgressLabelOverride : getDefaultAccessibilityLabel(i18n, progress, tone);
	let accessibilityMarkup = Boolean(accessibilityLabel) && /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		visuallyHidden: true
	}, accessibilityLabel);
	if (progress && !icon) accessibilityMarkup = /* @__PURE__ */ React.createElement("span", { className: styles$60.Icon }, /* @__PURE__ */ React.createElement(Icon, {
		accessibilityLabel,
		source: progressIconMap[progress]
	}));
	return /* @__PURE__ */ React.createElement("span", { className }, accessibilityMarkup, icon && /* @__PURE__ */ React.createElement("span", { className: styles$60.Icon }, /* @__PURE__ */ React.createElement(Icon, { source: icon })), children && /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodySm",
		fontWeight: tone === "new" ? "medium" : void 0
	}, children));
}
Badge.Pip = Pip;
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-toggle.js
/**
* Returns a stateful value, and a set of memoized functions to toggle it,
* set it to true and set it to false
*/
function useToggle(initialState) {
	const [value, setState] = useState(initialState);
	return {
		value,
		toggle: useCallback(() => setState((state) => !state), []),
		setTrue: useCallback(() => setState(true), []),
		setFalse: useCallback(() => setState(false), [])
	};
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tooltip/Tooltip.css.js
var styles$58 = {
	"TooltipContainer": "Polaris-Tooltip__TooltipContainer",
	"HasUnderline": "Polaris-Tooltip__HasUnderline"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/ephemeral-presence-manager/hooks.js
function useEphemeralPresenceManager() {
	const ephemeralPresenceManager = useContext(EphemeralPresenceManagerContext);
	if (!ephemeralPresenceManager) throw new Error("No ephemeral presence manager was provided. Your application must be wrapped in an <AppProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.");
	return ephemeralPresenceManager;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/portals/hooks.js
function usePortalsManager() {
	const portalsManager = useContext(PortalsManagerContext);
	if (!portalsManager) throw new Error("No portals manager was provided. Your application must be wrapped in an <AppProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.");
	return portalsManager;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Portal/Portal.js
function Portal({ children, idPrefix = "", onPortalCreated = noop$8 }) {
	const themeName = useThemeName();
	const { container } = usePortalsManager();
	const uniqueId = useId();
	const portalId = idPrefix !== "" ? `${idPrefix}-${uniqueId}` : uniqueId;
	useEffect(() => {
		onPortalCreated();
	}, [onPortalCreated]);
	return container ? /* @__PURE__ */ createPortal(/* @__PURE__ */ React.createElement(ThemeProvider, {
		theme: isThemeNameLocal(themeName) ? themeName : themeNameDefault,
		"data-portal-id": portalId
	}, children), container) : null;
}
function noop$8() {}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tooltip/components/TooltipOverlay/TooltipOverlay.css.js
var styles$57 = {
	"TooltipOverlay": "Polaris-Tooltip-TooltipOverlay",
	"Tail": "Polaris-Tooltip-TooltipOverlay__Tail",
	"positionedAbove": "Polaris-Tooltip-TooltipOverlay--positionedAbove",
	"measuring": "Polaris-Tooltip-TooltipOverlay--measuring",
	"measured": "Polaris-Tooltip-TooltipOverlay--measured",
	"instant": "Polaris-Tooltip-TooltipOverlay--instant",
	"Content": "Polaris-Tooltip-TooltipOverlay__Content",
	"default": "Polaris-Tooltip-TooltipOverlay--default",
	"wide": "Polaris-Tooltip-TooltipOverlay--wide"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/PositionedOverlay/utilities/math.js
function calculateVerticalPosition(activatorRect, overlayRect, overlayMargins, scrollableContainerRect, containerRect, preferredPosition, fixed, topBarOffset = 0) {
	const activatorTop = activatorRect.top;
	const activatorBottom = activatorTop + activatorRect.height;
	const spaceAbove = activatorRect.top - topBarOffset;
	const spaceBelow = containerRect.height - activatorRect.top - activatorRect.height;
	const desiredHeight = overlayRect.height;
	const verticalMargins = overlayMargins.activator + overlayMargins.container;
	const minimumSpaceToScroll = overlayMargins.container;
	const distanceToTopScroll = activatorRect.top - Math.max(scrollableContainerRect.top, 0);
	const distanceToBottomScroll = containerRect.top + Math.min(containerRect.height, scrollableContainerRect.top + scrollableContainerRect.height) - (activatorRect.top + activatorRect.height);
	const enoughSpaceFromTopScroll = distanceToTopScroll >= minimumSpaceToScroll;
	const enoughSpaceFromBottomScroll = distanceToBottomScroll >= minimumSpaceToScroll;
	const heightIfAbove = Math.min(spaceAbove, desiredHeight);
	const heightIfBelow = Math.min(spaceBelow, desiredHeight);
	const heightIfAboveCover = Math.min(spaceAbove + activatorRect.height, desiredHeight);
	const heightIfBelowCover = Math.min(spaceBelow + activatorRect.height, desiredHeight);
	const containerRectTop = fixed ? 0 : containerRect.top;
	const positionIfAbove = {
		height: heightIfAbove - verticalMargins,
		top: activatorTop + containerRectTop - heightIfAbove,
		positioning: "above"
	};
	const positionIfBelow = {
		height: heightIfBelow - verticalMargins,
		top: activatorBottom + containerRectTop,
		positioning: "below"
	};
	const positionIfCoverBelow = {
		height: heightIfBelowCover - verticalMargins,
		top: activatorTop + containerRectTop,
		positioning: "cover"
	};
	const positionIfCoverAbove = {
		height: heightIfAboveCover - verticalMargins,
		top: activatorTop + containerRectTop - heightIfAbove + activatorRect.height + verticalMargins,
		positioning: "cover"
	};
	if (preferredPosition === "above") return (enoughSpaceFromTopScroll || distanceToTopScroll >= distanceToBottomScroll && !enoughSpaceFromBottomScroll) && (spaceAbove > desiredHeight || spaceAbove > spaceBelow) ? positionIfAbove : positionIfBelow;
	if (preferredPosition === "below") return (enoughSpaceFromBottomScroll || distanceToBottomScroll >= distanceToTopScroll && !enoughSpaceFromTopScroll) && (spaceBelow > desiredHeight || spaceBelow > spaceAbove) ? positionIfBelow : positionIfAbove;
	if (preferredPosition === "cover") return (enoughSpaceFromBottomScroll || distanceToBottomScroll >= distanceToTopScroll && !enoughSpaceFromTopScroll) && (spaceBelow + activatorRect.height > desiredHeight || spaceBelow > spaceAbove) ? positionIfCoverBelow : positionIfCoverAbove;
	if (enoughSpaceFromTopScroll && enoughSpaceFromBottomScroll) return spaceAbove > spaceBelow ? positionIfAbove : positionIfBelow;
	return distanceToTopScroll > minimumSpaceToScroll ? positionIfAbove : positionIfBelow;
}
function calculateHorizontalPosition(activatorRect, overlayRect, containerRect, overlayMargins, preferredAlignment) {
	const maximum = containerRect.width - overlayRect.width;
	if (preferredAlignment === "left") return Math.min(maximum, Math.max(0, activatorRect.left - overlayMargins.horizontal));
	else if (preferredAlignment === "right") {
		const activatorRight = containerRect.width - (activatorRect.left + activatorRect.width);
		return Math.min(maximum, Math.max(0, activatorRight - overlayMargins.horizontal));
	}
	return Math.min(maximum, Math.max(0, activatorRect.center.x - overlayRect.width / 2));
}
function rectIsOutsideOfRect(inner, outer) {
	const { center } = inner;
	return center.y < outer.top || center.y > outer.top + outer.height;
}
function intersectionWithViewport(rect, viewport = windowRect()) {
	const top = Math.max(rect.top, 0);
	const left = Math.max(rect.left, 0);
	const bottom = Math.min(rect.top + rect.height, viewport.height);
	const right = Math.min(rect.left + rect.width, viewport.width);
	return new Rect({
		top,
		left,
		height: bottom - top,
		width: right - left
	});
}
function windowRect(node) {
	const document = node?.ownerDocument || globalThis.document;
	const window = document.defaultView || globalThis.window;
	return new Rect({
		top: window.scrollY,
		left: window.scrollX,
		height: window.innerHeight,
		width: document.body.clientWidth
	});
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/PositionedOverlay/PositionedOverlay.css.js
var styles$56 = {
	"PositionedOverlay": "Polaris-PositionedOverlay",
	"fixed": "Polaris-PositionedOverlay--fixed",
	"calculating": "Polaris-PositionedOverlay--calculating",
	"preventInteraction": "Polaris-PositionedOverlay--preventInteraction"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-lazy-ref.js
var UNIQUE_IDENTIFIER = Symbol("unique_identifier");
/**
* useLazyRef provides a lazy initial value, similar to lazy
* initial state the initialValue is the value used during
* initialization and disregarded after that. Use this hook
* for expensive initialization.
* @param initialValue - A function that will return the initial
* value and be disregarded after that
* @returns MutableRefObject<T> - Returns a ref object with the
* results from invoking initial value
* @example
* function ComponentExample() {
*  const title = useLazyRef(() => someExpensiveComputation());
*  return <h1>{title.current}</h1>;
* }
*/
function useLazyRef(initialValue) {
	const lazyRef = useRef(UNIQUE_IDENTIFIER);
	if (lazyRef.current === UNIQUE_IDENTIFIER) lazyRef.current = initialValue();
	return lazyRef;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-component-did-mount.js
/**
* Similarly to the life-cycle method componentDidMount, useComponentDidMount
* will be invoked after the component has mounted, and only the initial mount.
* @param callback Defines a callback to invoke once the component has
* initially mounted.
* @example
* function Playground({active}) {
*  useComponentDidMount(() => {
*    if (active) {
*      console.warning(`Component has mounted.`);
*    }
*  });
*
*  return null;
* }
*/
function useComponentDidMount(callback) {
	const isAfterInitialMount = useIsAfterInitialMount();
	const hasInvokedLifeCycle = useRef(false);
	if (isAfterInitialMount && !hasInvokedLifeCycle.current) {
		hasInvokedLifeCycle.current = true;
		return callback();
	}
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Scrollable/context.js
var ScrollableContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Scrollable/Scrollable.css.js
var styles$55 = {
	"Scrollable": "Polaris-Scrollable",
	"hasTopShadow": "Polaris-Scrollable--hasTopShadow",
	"hasBottomShadow": "Polaris-Scrollable--hasBottomShadow",
	"horizontal": "Polaris-Scrollable--horizontal",
	"vertical": "Polaris-Scrollable--vertical",
	"scrollbarWidthThin": "Polaris-Scrollable--scrollbarWidthThin",
	"scrollbarWidthNone": "Polaris-Scrollable--scrollbarWidthNone",
	"scrollbarWidthAuto": "Polaris-Scrollable--scrollbarWidthAuto",
	"scrollbarGutterStable": "Polaris-Scrollable--scrollbarGutterStable",
	"scrollbarGutterStableboth-edges": "Polaris-Scrollable__scrollbarGutterStableboth--edges"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Scrollable/components/ScrollTo/ScrollTo.js
function ScrollTo() {
	const anchorNode = useRef(null);
	const scrollToPosition = useContext(ScrollableContext);
	useEffect(() => {
		if (!scrollToPosition || !anchorNode.current) return;
		scrollToPosition(anchorNode.current.offsetTop);
	}, [scrollToPosition]);
	const id = useId();
	return /* @__PURE__ */ React.createElement("a", {
		id,
		ref: anchorNode
	});
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Scrollable/Scrollable.js
var MAX_SCROLL_HINT_DISTANCE = 100;
var LOW_RES_BUFFER = 2;
var ScrollableComponent = /* @__PURE__ */ forwardRef(({ children, className, horizontal = true, vertical = true, shadow, hint, focusable, scrollbarWidth = "thin", scrollbarGutter, onScrolledToBottom, ...rest }, forwardedRef) => {
	const [topShadow, setTopShadow] = useState(false);
	const [bottomShadow, setBottomShadow] = useState(false);
	const stickyManager = useLazyRef(() => new StickyManager());
	const scrollArea = useRef(null);
	const scrollTo = useCallback((scrollY, options = {}) => {
		const optionsBehavior = options.behavior || "smooth";
		const behavior = prefersReducedMotion() ? "auto" : optionsBehavior;
		scrollArea.current?.scrollTo({
			top: scrollY,
			behavior
		});
	}, []);
	const defaultRef = useRef();
	useImperativeHandle(forwardedRef || defaultRef, () => ({ scrollTo }));
	const handleScroll = useCallback(() => {
		const currentScrollArea = scrollArea.current;
		if (!currentScrollArea) return;
		requestAnimationFrame(() => {
			const { scrollTop, clientHeight, scrollHeight } = currentScrollArea;
			const canScroll = Boolean(scrollHeight > clientHeight);
			const isBelowTopOfScroll = Boolean(scrollTop > 0);
			const isAtBottomOfScroll = Boolean(scrollTop + clientHeight >= scrollHeight - LOW_RES_BUFFER);
			setTopShadow(isBelowTopOfScroll);
			setBottomShadow(!isAtBottomOfScroll);
			if (canScroll && isAtBottomOfScroll && onScrolledToBottom) onScrolledToBottom();
		});
	}, [onScrolledToBottom]);
	useComponentDidMount(() => {
		handleScroll();
		if (hint) requestAnimationFrame(() => performScrollHint(scrollArea.current));
	});
	useEffect(() => {
		const currentScrollArea = scrollArea.current;
		if (!currentScrollArea) return;
		const handleResize = debounce(handleScroll, 50, { trailing: true });
		stickyManager.current?.setContainer(currentScrollArea);
		currentScrollArea.addEventListener("scroll", handleScroll);
		globalThis.addEventListener("resize", handleResize);
		return () => {
			currentScrollArea.removeEventListener("scroll", handleScroll);
			globalThis.removeEventListener("resize", handleResize);
		};
	}, [stickyManager, handleScroll]);
	const finalClassName = classNames(className, styles$55.Scrollable, vertical && styles$55.vertical, horizontal && styles$55.horizontal, shadow && topShadow && styles$55.hasTopShadow, shadow && bottomShadow && styles$55.hasBottomShadow, scrollbarWidth && styles$55[variationName("scrollbarWidth", scrollbarWidth)], scrollbarGutter && styles$55[variationName("scrollbarGutter", scrollbarGutter.replace(" ", ""))]);
	return /* @__PURE__ */ React.createElement(ScrollableContext.Provider, { value: scrollTo }, /* @__PURE__ */ React.createElement(StickyManagerContext.Provider, { value: stickyManager.current }, /* @__PURE__ */ React.createElement("div", Object.assign({ className: finalClassName }, scrollable.props, rest, {
		ref: scrollArea,
		tabIndex: focusable ? 0 : void 0
	}), children)));
});
ScrollableComponent.displayName = "Scrollable";
function prefersReducedMotion() {
	try {
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	} catch (err) {
		return false;
	}
}
function performScrollHint(elem) {
	if (!elem || prefersReducedMotion()) return;
	const scrollableDistance = elem.scrollHeight - elem.clientHeight;
	const distanceToPeek = Math.min(MAX_SCROLL_HINT_DISTANCE, scrollableDistance) - LOW_RES_BUFFER;
	const goBackToTop = () => {
		requestAnimationFrame(() => {
			if (elem.scrollTop >= distanceToPeek) {
				elem.removeEventListener("scroll", goBackToTop);
				elem.scrollTo({
					top: 0,
					behavior: "smooth"
				});
			}
		});
	};
	elem.addEventListener("scroll", goBackToTop);
	elem.scrollTo({
		top: MAX_SCROLL_HINT_DISTANCE,
		behavior: "smooth"
	});
}
var forNode = (node) => {
	const closestElement = node.closest(scrollable.selector);
	return closestElement instanceof HTMLElement ? closestElement : document;
};
var Scrollable = ScrollableComponent;
Scrollable.ScrollTo = ScrollTo;
Scrollable.forNode = forNode;
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/PositionedOverlay/PositionedOverlay.js
var OBSERVER_CONFIG = {
	childList: true,
	subtree: true,
	characterData: true,
	attributeFilter: ["style"]
};
var PositionedOverlay = class extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			measuring: true,
			activatorRect: getRectForNode(this.props.activator),
			right: void 0,
			left: void 0,
			top: 0,
			height: 0,
			width: null,
			positioning: "below",
			zIndex: null,
			outsideScrollableContainer: false,
			lockPosition: false,
			chevronOffset: 0
		};
		this.overlay = null;
		this.scrollableContainers = [];
		this.overlayDetails = () => {
			const { measuring, left, right, positioning, height, activatorRect, chevronOffset } = this.state;
			return {
				measuring,
				left,
				right,
				desiredHeight: height,
				positioning,
				activatorRect,
				chevronOffset
			};
		};
		this.setOverlay = (node) => {
			this.overlay = node;
		};
		this.setScrollableContainers = () => {
			const containers = [];
			let scrollableContainer = Scrollable.forNode(this.props.activator);
			if (scrollableContainer) {
				containers.push(scrollableContainer);
				while (scrollableContainer?.parentElement) {
					scrollableContainer = Scrollable.forNode(scrollableContainer.parentElement);
					containers.push(scrollableContainer);
				}
			}
			this.scrollableContainers = containers;
		};
		this.registerScrollHandlers = () => {
			this.scrollableContainers.forEach((node) => {
				node.addEventListener("scroll", this.handleMeasurement);
			});
		};
		this.unregisterScrollHandlers = () => {
			this.scrollableContainers.forEach((node) => {
				node.removeEventListener("scroll", this.handleMeasurement);
			});
		};
		this.handleMeasurement = () => {
			const { lockPosition, top } = this.state;
			this.observer.disconnect();
			this.setState(({ left, top, right }) => ({
				left,
				right,
				top,
				height: 0,
				positioning: "below",
				measuring: true
			}), () => {
				if (this.overlay == null || this.firstScrollableContainer == null) return;
				const { activator, preferredPosition = "below", preferredAlignment = "center", onScrollOut, fullWidth, fixed, preferInputActivator = true } = this.props;
				const document = activator.ownerDocument;
				const activatorRect = getRectForNode(preferInputActivator ? activator.querySelector("input") || activator : activator);
				const currentOverlayRect = getRectForNode(this.overlay);
				const scrollableElement = isDocument(this.firstScrollableContainer) ? document.body : this.firstScrollableContainer;
				const scrollableContainerRect = getRectForNode(scrollableElement);
				const overlayRect = fullWidth || preferredPosition === "cover" ? new Rect({
					...currentOverlayRect,
					width: activatorRect.width
				}) : currentOverlayRect;
				if (scrollableElement === document.body) scrollableContainerRect.height = document.body.scrollHeight;
				let topBarOffset = 0;
				const topBarElement = scrollableElement.querySelector(`${dataPolarisTopBar.selector}`);
				if (topBarElement) topBarOffset = topBarElement.clientHeight;
				let overlayMargins = {
					activator: 0,
					container: 0,
					horizontal: 0
				};
				if (this.overlay.firstElementChild) overlayMargins = getMarginsForNode(this.overlay.firstElementChild);
				const containerRect = windowRect(activator);
				const zIndexForLayer = getZIndexForLayerFromNode(activator);
				const zIndex = zIndexForLayer == null ? zIndexForLayer : zIndexForLayer + 1;
				const verticalPosition = calculateVerticalPosition(activatorRect, overlayRect, overlayMargins, scrollableContainerRect, containerRect, preferredPosition, fixed, topBarOffset);
				const horizontalPosition = calculateHorizontalPosition(activatorRect, overlayRect, containerRect, overlayMargins, preferredAlignment);
				const chevronOffset = activatorRect.center.x - horizontalPosition + overlayMargins.horizontal * 2;
				this.setState({
					measuring: false,
					activatorRect: getRectForNode(activator),
					left: preferredAlignment !== "right" ? horizontalPosition : void 0,
					right: preferredAlignment === "right" ? horizontalPosition : void 0,
					top: lockPosition ? top : verticalPosition.top,
					lockPosition: Boolean(fixed),
					height: verticalPosition.height || 0,
					width: fullWidth || preferredPosition === "cover" ? overlayRect.width : null,
					positioning: verticalPosition.positioning,
					outsideScrollableContainer: onScrollOut != null && rectIsOutsideOfRect(activatorRect, intersectionWithViewport(scrollableContainerRect, containerRect)),
					zIndex,
					chevronOffset
				}, () => {
					if (!this.overlay) return;
					this.observer.observe(this.overlay, OBSERVER_CONFIG);
					this.observer.observe(activator, OBSERVER_CONFIG);
				});
			});
		};
		this.observer = new MutationObserver(this.handleMeasurement);
	}
	componentDidMount() {
		this.setScrollableContainers();
		if (this.scrollableContainers.length && !this.props.fixed) this.registerScrollHandlers();
		this.handleMeasurement();
	}
	componentWillUnmount() {
		this.observer.disconnect();
		if (this.scrollableContainers.length && !this.props.fixed) this.unregisterScrollHandlers();
	}
	componentDidUpdate() {
		const { outsideScrollableContainer, top } = this.state;
		const { onScrollOut, active } = this.props;
		if (active && onScrollOut != null && top !== 0 && outsideScrollableContainer) onScrollOut();
	}
	render() {
		const { left, right, top, zIndex, width } = this.state;
		const { render, fixed, preventInteraction, classNames: propClassNames, zIndexOverride } = this.props;
		const style = {
			top: top == null || isNaN(top) ? void 0 : top,
			left: left == null || isNaN(left) ? void 0 : left,
			right: right == null || isNaN(right) ? void 0 : right,
			width: width == null || isNaN(width) ? void 0 : width,
			zIndex: zIndexOverride || zIndex || void 0
		};
		const className = classNames(styles$56.PositionedOverlay, fixed && styles$56.fixed, preventInteraction && styles$56.preventInteraction, propClassNames);
		return /* @__PURE__ */ React.createElement("div", {
			className,
			style,
			ref: this.setOverlay
		}, /* @__PURE__ */ React.createElement(EventListener, {
			event: "resize",
			handler: this.handleMeasurement,
			window: this.overlay?.ownerDocument.defaultView
		}), render(this.overlayDetails()));
	}
	get firstScrollableContainer() {
		return this.scrollableContainers[0] ?? null;
	}
	forceUpdatePosition() {
		requestAnimationFrame(this.handleMeasurement);
	}
};
function getMarginsForNode(node) {
	const nodeStyles = (node.ownerDocument.defaultView || globalThis.window).getComputedStyle(node);
	return {
		activator: parseFloat(nodeStyles.marginTop || "0"),
		container: parseFloat(nodeStyles.marginBottom || "0"),
		horizontal: parseFloat(nodeStyles.marginLeft || "0")
	};
}
function getZIndexForLayerFromNode(node) {
	const layerNode = node.closest(layer.selector) || node.ownerDocument.body;
	const zIndex = layerNode === node.ownerDocument.body ? "auto" : parseInt(window.getComputedStyle(layerNode).zIndex || "0", 10);
	return zIndex === "auto" || isNaN(zIndex) ? null : zIndex;
}
function isDocument(node) {
	return node.ownerDocument === null;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tooltip/components/TooltipOverlay/TooltipOverlay.js
var tailUpPaths = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", {
	d: "M18.829 8.171 11.862.921A3 3 0 0 0 7.619.838L0 8.171h1.442l6.87-6.612a2 2 0 0 1 2.83.055l6.3 6.557h1.387Z",
	fill: "var(--p-color-tooltip-tail-up-border)"
}), /* @__PURE__ */ React.createElement("path", {
	d: "M17.442 10.171h-16v-2l6.87-6.612a2 2 0 0 1 2.83.055l6.3 6.557v2Z",
	fill: "var(--p-color-bg-surface)"
}));
var tailDownPaths = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("path", {
	d: "m0 2 6.967 7.25a3 3 0 0 0 4.243.083L18.829 2h-1.442l-6.87 6.612a2 2 0 0 1-2.83-.055L1.387 2H0Z",
	fill: "var(--p-color-tooltip-tail-down-border)"
}), /* @__PURE__ */ React.createElement("path", {
	d: "M1.387 0h16v2l-6.87 6.612a2 2 0 0 1-2.83-.055L1.387 2V0Z",
	fill: "var(--p-color-bg-surface)"
}));
function TooltipOverlay({ active, activator, preferredPosition = "above", preventInteraction, id, children, accessibilityLabel, width, padding, borderRadius, zIndexOverride, instant }) {
	const i18n = useI18n();
	return active ? /* @__PURE__ */ React.createElement(PositionedOverlay, {
		active,
		activator,
		preferredPosition,
		preventInteraction,
		render: renderTooltip,
		zIndexOverride
	}) : null;
	function renderTooltip(overlayDetails) {
		const { measuring, desiredHeight, positioning, chevronOffset } = overlayDetails;
		const containerClassName = classNames(styles$57.TooltipOverlay, measuring && styles$57.measuring, !measuring && styles$57.measured, instant && styles$57.instant, positioning === "above" && styles$57.positionedAbove);
		const contentClassName = classNames(styles$57.Content, width && styles$57[width]);
		const contentStyles = measuring ? void 0 : { minHeight: desiredHeight };
		const style = {
			"--pc-tooltip-chevron-x-pos": `${chevronOffset}px`,
			"--pc-tooltip-border-radius": borderRadius ? `var(--p-border-radius-${borderRadius})` : void 0,
			"--pc-tooltip-padding": padding && padding === "default" ? "var(--p-space-100) var(--p-space-200)" : `var(--p-space-${padding})`
		};
		return /* @__PURE__ */ React.createElement("div", Object.assign({
			style,
			className: containerClassName
		}, layer.props), /* @__PURE__ */ React.createElement("svg", {
			className: styles$57.Tail,
			width: "19",
			height: "11",
			fill: "none"
		}, positioning === "above" ? tailDownPaths : tailUpPaths), /* @__PURE__ */ React.createElement("div", {
			id,
			role: "tooltip",
			className: contentClassName,
			style: {
				...contentStyles,
				...style
			},
			"aria-label": accessibilityLabel ? i18n.translate("Polaris.TooltipOverlay.accessibilityLabel", { label: accessibilityLabel }) : void 0
		}, children));
	}
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tooltip/Tooltip.js
var HOVER_OUT_TIMEOUT = 150;
function Tooltip({ children, content, dismissOnMouseOut, active: originalActive, hoverDelay, preferredPosition = "above", activatorWrapper = "span", accessibilityLabel, width = "default", padding = "default", borderRadius: borderRadiusProp, zIndexOverride, hasUnderline, persistOnClick, onOpen, onClose }) {
	const borderRadius = borderRadiusProp || "200";
	const WrapperComponent = activatorWrapper;
	const { value: active, setTrue: setActiveTrue, setFalse: handleBlur } = useToggle(Boolean(originalActive));
	const { value: persist, toggle: togglePersisting } = useToggle(Boolean(originalActive) && Boolean(persistOnClick));
	const [activatorNode, setActivatorNode] = useState(null);
	const { presenceList, addPresence, removePresence } = useEphemeralPresenceManager();
	const id = useId();
	const activatorContainer = useRef(null);
	const mouseEntered = useRef(false);
	const [shouldAnimate, setShouldAnimate] = useState(Boolean(!originalActive));
	const hoverDelayTimeout = useRef(null);
	const hoverOutTimeout = useRef(null);
	const handleFocus = useCallback(() => {
		if (originalActive !== false) setActiveTrue();
	}, [originalActive, setActiveTrue]);
	useEffect(() => {
		const accessibilityNode = (activatorContainer.current ? findFirstFocusableNode(activatorContainer.current) : null) || activatorContainer.current;
		if (!accessibilityNode) return;
		accessibilityNode.tabIndex = 0;
		accessibilityNode.setAttribute("aria-describedby", id);
		accessibilityNode.setAttribute("data-polaris-tooltip-activator", "true");
	}, [id, children]);
	useEffect(() => {
		return () => {
			if (hoverDelayTimeout.current) clearTimeout(hoverDelayTimeout.current);
			if (hoverOutTimeout.current) clearTimeout(hoverOutTimeout.current);
		};
	}, []);
	const handleOpen = useCallback(() => {
		setShouldAnimate(!presenceList.tooltip && !active);
		onOpen?.();
		addPresence("tooltip");
	}, [
		addPresence,
		presenceList.tooltip,
		onOpen,
		active
	]);
	const handleClose = useCallback(() => {
		onClose?.();
		setShouldAnimate(false);
		hoverOutTimeout.current = setTimeout(() => {
			removePresence("tooltip");
		}, HOVER_OUT_TIMEOUT);
	}, [removePresence, onClose]);
	const handleKeyUp = useCallback((event) => {
		if (event.key !== "Escape") return;
		handleClose?.();
		handleBlur();
		persistOnClick && togglePersisting();
	}, [
		handleBlur,
		handleClose,
		persistOnClick,
		togglePersisting
	]);
	useEffect(() => {
		if (originalActive === false && active) {
			handleClose();
			handleBlur();
		}
	}, [
		originalActive,
		active,
		handleClose,
		handleBlur
	]);
	const portal = activatorNode ? /* @__PURE__ */ React.createElement(Portal, { idPrefix: "tooltip" }, /* @__PURE__ */ React.createElement(TooltipOverlay, {
		id,
		preferredPosition,
		activator: activatorNode,
		active,
		accessibilityLabel,
		onClose: noop$7,
		preventInteraction: dismissOnMouseOut,
		width,
		padding,
		borderRadius,
		zIndexOverride,
		instant: !shouldAnimate
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd"
	}, content))) : null;
	const wrapperClassNames = classNames(activatorWrapper === "div" && styles$58.TooltipContainer, hasUnderline && styles$58.HasUnderline);
	return /* @__PURE__ */ React.createElement(WrapperComponent, {
		onFocus: () => {
			handleOpen();
			handleFocus();
		},
		onBlur: () => {
			handleClose();
			handleBlur();
			if (persistOnClick) togglePersisting();
		},
		onMouseLeave: handleMouseLeave,
		onMouseOver: handleMouseEnterFix,
		onMouseDown: persistOnClick ? togglePersisting : void 0,
		ref: setActivator,
		onKeyUp: handleKeyUp,
		className: wrapperClassNames
	}, children, portal);
	function setActivator(node) {
		const activatorContainerRef = activatorContainer;
		if (node == null) {
			activatorContainerRef.current = null;
			setActivatorNode(null);
			return;
		}
		if (node.firstElementChild) setActivatorNode(node.firstElementChild);
		activatorContainerRef.current = node;
	}
	function handleMouseEnter() {
		mouseEntered.current = true;
		if (hoverDelay && !presenceList.tooltip) hoverDelayTimeout.current = setTimeout(() => {
			handleOpen();
			handleFocus();
		}, hoverDelay);
		else {
			handleOpen();
			handleFocus();
		}
	}
	function handleMouseLeave() {
		if (hoverDelayTimeout.current) {
			clearTimeout(hoverDelayTimeout.current);
			hoverDelayTimeout.current = null;
		}
		mouseEntered.current = false;
		handleClose();
		if (!persist) handleBlur();
	}
	function handleMouseEnterFix() {
		!mouseEntered.current && handleMouseEnter();
	}
}
function noop$7() {}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionList/components/Item/Item.js
function Item$6({ id, badge, content, accessibilityLabel, helpText, url, onAction, onMouseEnter, icon, image, prefix, suffix, disabled, external, destructive, ellipsis, truncate, active, role, variant = "default" }) {
	const className = classNames(styles$61.Item, disabled && styles$61.disabled, destructive && styles$61.destructive, active && styles$61.active, variant === "default" && styles$61.default, variant === "indented" && styles$61.indented, variant === "menu" && styles$61.menu);
	let prefixMarkup = null;
	if (prefix) prefixMarkup = /* @__PURE__ */ React.createElement("span", { className: styles$61.Prefix }, prefix);
	else if (icon) prefixMarkup = /* @__PURE__ */ React.createElement("span", { className: styles$61.Prefix }, /* @__PURE__ */ React.createElement(Icon, { source: icon }));
	else if (image) prefixMarkup = /* @__PURE__ */ React.createElement("span", {
		role: "presentation",
		className: styles$61.Prefix,
		style: { backgroundImage: `url(${image}` }
	});
	let contentText = content || "";
	if (truncate && content) contentText = /* @__PURE__ */ React.createElement(TruncateText, null, content);
	else if (ellipsis) contentText = `${content}…`;
	const contentMarkup = helpText ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Box, null, contentText), /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodySm",
		tone: active || disabled ? void 0 : "subdued"
	}, helpText)) : /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd",
		fontWeight: active ? "semibold" : "regular"
	}, contentText);
	const badgeMarkup = badge && /* @__PURE__ */ React.createElement("span", { className: styles$61.Suffix }, /* @__PURE__ */ React.createElement(Badge, { tone: badge.tone }, badge.content));
	const suffixMarkup = suffix && /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement("span", { className: styles$61.Suffix }, suffix));
	const textMarkup = /* @__PURE__ */ React.createElement("span", { className: styles$61.Text }, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd",
		fontWeight: active ? "semibold" : "regular"
	}, contentMarkup));
	const contentElement = /* @__PURE__ */ React.createElement(InlineStack, {
		blockAlign: "center",
		gap: "150",
		wrap: false
	}, prefixMarkup, textMarkup, badgeMarkup, suffixMarkup);
	const contentWrapper = /* @__PURE__ */ React.createElement(Box, { width: "100%" }, contentElement);
	const scrollMarkup = active ? /* @__PURE__ */ React.createElement(Scrollable.ScrollTo, null) : null;
	const control = url ? /* @__PURE__ */ React.createElement(UnstyledLink, {
		id,
		url: disabled ? null : url,
		className,
		external,
		"aria-label": accessibilityLabel,
		onClick: disabled ? null : onAction,
		role
	}, contentWrapper) : /* @__PURE__ */ React.createElement("button", {
		id,
		type: "button",
		className,
		disabled,
		"aria-label": accessibilityLabel,
		onClick: onAction,
		onMouseUp: handleMouseUpByBlurring,
		role,
		onMouseEnter
	}, contentWrapper);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, scrollMarkup, control);
}
var TruncateText = ({ children }) => {
	const theme = useTheme();
	const textRef = useRef(null);
	const [isOverflowing, setIsOverflowing] = useState(false);
	useIsomorphicLayoutEffect(() => {
		if (textRef.current) setIsOverflowing(textRef.current.scrollWidth > textRef.current.offsetWidth);
	}, [children]);
	return isOverflowing ? /* @__PURE__ */ React.createElement(Tooltip, {
		zIndexOverride: Number(theme.zIndex["z-index-11"]),
		preferredPosition: "above",
		hoverDelay: 1e3,
		content: children,
		dismissOnMouseOut: true
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		truncate: true
	}, children)) : /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		truncate: true
	}, /* @__PURE__ */ React.createElement(Box, {
		width: "100%",
		ref: textRef
	}, children));
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionList/components/Section/Section.js
function Section$3({ section, hasMultipleSections, isFirst, actionRole, onActionAnyItem }) {
	const handleAction = (itemOnAction) => {
		return () => {
			if (itemOnAction) itemOnAction();
			if (onActionAnyItem) onActionAnyItem();
		};
	};
	const actionMarkup = section.items.map(({ content, helpText, onAction, ...item }, index) => {
		const itemMarkup = /* @__PURE__ */ React.createElement(Item$6, Object.assign({
			content,
			helpText,
			role: actionRole,
			onAction: handleAction(onAction)
		}, item));
		return /* @__PURE__ */ React.createElement(Box, {
			as: "li",
			key: `${content}-${index}`,
			role: actionRole === "menuitem" ? "presentation" : void 0
		}, /* @__PURE__ */ React.createElement(InlineStack, { wrap: false }, itemMarkup));
	});
	let titleMarkup = null;
	if (section.title) titleMarkup = typeof section.title === "string" ? /* @__PURE__ */ React.createElement(Box, {
		paddingBlockStart: "300",
		paddingBlockEnd: "100",
		paddingInlineStart: "300",
		paddingInlineEnd: "300"
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "p",
		variant: "headingSm"
	}, section.title)) : /* @__PURE__ */ React.createElement(Box, {
		padding: "200",
		paddingInlineEnd: "150"
	}, section.title);
	let sectionRole;
	switch (actionRole) {
		case "option":
			sectionRole = "presentation";
			break;
		case "menuitem":
			sectionRole = !hasMultipleSections ? "menu" : "presentation";
			break;
		default:
			sectionRole = void 0;
			break;
	}
	const sectionMarkup = /* @__PURE__ */ React.createElement(React.Fragment, null, titleMarkup, /* @__PURE__ */ React.createElement(Box, Object.assign({
		as: "div",
		padding: "150"
	}, hasMultipleSections && { paddingBlockStart: "0" }, { tabIndex: !hasMultipleSections ? -1 : void 0 }), /* @__PURE__ */ React.createElement(BlockStack, Object.assign({
		gap: "050",
		as: "ul"
	}, sectionRole && { role: sectionRole }), actionMarkup)));
	return hasMultipleSections ? /* @__PURE__ */ React.createElement(Box, Object.assign({
		as: "li",
		role: "presentation",
		borderColor: "border-secondary"
	}, !isFirst && { borderBlockStartWidth: "025" }, !section.title && { paddingBlockStart: "150" }), sectionMarkup) : sectionMarkup;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/KeypressListener/KeypressListener.js
function KeypressListener({ keyCode, handler, keyEvent = "keyup", options, useCapture, document: ownerDocument = globalThis.document }) {
	const tracked = useRef({
		handler,
		keyCode
	});
	useIsomorphicLayoutEffect(() => {
		tracked.current = {
			handler,
			keyCode
		};
	}, [handler, keyCode]);
	const handleKeyEvent = useCallback((event) => {
		const { handler, keyCode } = tracked.current;
		if (event.keyCode === keyCode) handler(event);
	}, []);
	useEffect(() => {
		ownerDocument.addEventListener(keyEvent, handleKeyEvent, useCapture || options);
		return () => {
			ownerDocument.removeEventListener(keyEvent, handleKeyEvent, useCapture || options);
		};
	}, [
		keyEvent,
		handleKeyEvent,
		useCapture,
		options,
		ownerDocument
	]);
	return null;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/TextField/TextField.css.js
var styles$54 = {
	"TextField": "Polaris-TextField",
	"ClearButton": "Polaris-TextField__ClearButton",
	"Loading": "Polaris-TextField__Loading",
	"disabled": "Polaris-TextField--disabled",
	"error": "Polaris-TextField--error",
	"readOnly": "Polaris-TextField--readOnly",
	"Input": "Polaris-TextField__Input",
	"Backdrop": "Polaris-TextField__Backdrop",
	"multiline": "Polaris-TextField--multiline",
	"hasValue": "Polaris-TextField--hasValue",
	"focus": "Polaris-TextField--focus",
	"VerticalContent": "Polaris-TextField__VerticalContent",
	"InputAndSuffixWrapper": "Polaris-TextField__InputAndSuffixWrapper",
	"toneMagic": "Polaris-TextField--toneMagic",
	"Prefix": "Polaris-TextField__Prefix",
	"Suffix": "Polaris-TextField__Suffix",
	"AutoSizeWrapper": "Polaris-TextField__AutoSizeWrapper",
	"AutoSizeWrapperWithSuffix": "Polaris-TextField__AutoSizeWrapperWithSuffix",
	"suggestion": "Polaris-TextField--suggestion",
	"borderless": "Polaris-TextField--borderless",
	"slim": "Polaris-TextField--slim",
	"Input-hasClearButton": "Polaris-TextField__Input--hasClearButton",
	"Input-suffixed": "Polaris-TextField__Input--suffixed",
	"Input-alignRight": "Polaris-TextField__Input--alignRight",
	"Input-alignLeft": "Polaris-TextField__Input--alignLeft",
	"Input-alignCenter": "Polaris-TextField__Input--alignCenter",
	"Input-autoSize": "Polaris-TextField__Input--autoSize",
	"PrefixIcon": "Polaris-TextField__PrefixIcon",
	"CharacterCount": "Polaris-TextField__CharacterCount",
	"AlignFieldBottom": "Polaris-TextField__AlignFieldBottom",
	"Spinner": "Polaris-TextField__Spinner",
	"SpinnerIcon": "Polaris-TextField__SpinnerIcon",
	"Resizer": "Polaris-TextField__Resizer",
	"DummyInput": "Polaris-TextField__DummyInput",
	"Segment": "Polaris-TextField__Segment",
	"monospaced": "Polaris-TextField--monospaced"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Labelled/Labelled.css.js
var styles$53 = {
	"hidden": "Polaris-Labelled--hidden",
	"LabelWrapper": "Polaris-Labelled__LabelWrapper",
	"disabled": "Polaris-Labelled--disabled",
	"HelpText": "Polaris-Labelled__HelpText",
	"readOnly": "Polaris-Labelled--readOnly",
	"Error": "Polaris-Labelled__Error",
	"Action": "Polaris-Labelled__Action"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/InlineError/InlineError.css.js
var styles$52 = {
	"InlineError": "Polaris-InlineError",
	"Icon": "Polaris-InlineError__Icon"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/InlineError/InlineError.js
function InlineError({ message, fieldID }) {
	if (!message) return null;
	return /* @__PURE__ */ React.createElement("div", {
		id: errorTextID(fieldID),
		className: styles$52.InlineError
	}, /* @__PURE__ */ React.createElement("div", { className: styles$52.Icon }, /* @__PURE__ */ React.createElement(Icon, { source: SvgAlertCircleIcon })), /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd"
	}, message));
}
function errorTextID(id) {
	return `${id}Error`;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Label/Label.css.js
var styles$51 = {
	"Label": "Polaris-Label",
	"hidden": "Polaris-Label--hidden",
	"Text": "Polaris-Label__Text",
	"RequiredIndicator": "Polaris-Label__RequiredIndicator"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Label/Label.js
function labelID(id) {
	return `${id}Label`;
}
function Label({ children, id, hidden, requiredIndicator }) {
	const className = classNames(styles$51.Label, hidden && styles$51.hidden);
	return /* @__PURE__ */ React.createElement("div", { className }, /* @__PURE__ */ React.createElement("label", {
		id: labelID(id),
		htmlFor: id,
		className: classNames(styles$51.Text, requiredIndicator && styles$51.RequiredIndicator)
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd"
	}, children)));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Labelled/Labelled.js
function Labelled({ id, label, error, action, helpText, children, labelHidden, requiredIndicator, disabled, readOnly, ...rest }) {
	const className = classNames(labelHidden && styles$53.hidden, disabled && styles$53.disabled, readOnly && styles$53.readOnly);
	const actionMarkup = action ? /* @__PURE__ */ React.createElement("div", { className: styles$53.Action }, buttonFrom(action, { variant: "plain" })) : null;
	const helpTextMarkup = helpText ? /* @__PURE__ */ React.createElement("div", {
		className: styles$53.HelpText,
		id: helpTextID$1(id),
		"aria-disabled": disabled
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		tone: "subdued",
		variant: "bodyMd",
		breakWord: true
	}, helpText)) : null;
	const errorMarkup = error && typeof error !== "boolean" && /* @__PURE__ */ React.createElement("div", { className: styles$53.Error }, /* @__PURE__ */ React.createElement(InlineError, {
		message: error,
		fieldID: id
	}));
	const labelMarkup = label ? /* @__PURE__ */ React.createElement("div", { className: styles$53.LabelWrapper }, /* @__PURE__ */ React.createElement(Label, Object.assign({
		id,
		requiredIndicator
	}, rest, { hidden: false }), label), actionMarkup) : null;
	return /* @__PURE__ */ React.createElement("div", { className }, labelMarkup, children, errorMarkup, helpTextMarkup);
}
function helpTextID$1(id) {
	return `${id}HelpText`;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Connected/Connected.css.js
var styles$50 = {
	"Connected": "Polaris-Connected",
	"Item": "Polaris-Connected__Item",
	"Item-primary": "Polaris-Connected__Item--primary",
	"Item-focused": "Polaris-Connected__Item--focused"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Connected/components/Item/Item.js
function Item$5({ children, position }) {
	const { value: focused, setTrue: forceTrueFocused, setFalse: forceFalseFocused } = useToggle(false);
	const className = classNames(styles$50.Item, focused && styles$50["Item-focused"], position === "primary" ? styles$50["Item-primary"] : styles$50["Item-connection"]);
	return /* @__PURE__ */ React.createElement("div", {
		onBlur: forceFalseFocused,
		onFocus: forceTrueFocused,
		className
	}, children);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Connected/Connected.js
function Connected({ children, left, right }) {
	const leftConnectionMarkup = left ? /* @__PURE__ */ React.createElement(Item$5, { position: "left" }, left) : null;
	const rightConnectionMarkup = right ? /* @__PURE__ */ React.createElement(Item$5, { position: "right" }, right) : null;
	return /* @__PURE__ */ React.createElement("div", { className: styles$50.Connected }, leftConnectionMarkup, /* @__PURE__ */ React.createElement(Item$5, { position: "primary" }, children), rightConnectionMarkup);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/TextField/components/Spinner/Spinner.js
var Spinner = /* @__PURE__ */ React.forwardRef(function Spinner({ onChange, onClick, onMouseDown, onMouseUp, onBlur }, ref) {
	function handleStep(step) {
		return () => onChange(step);
	}
	function handleMouseDown(onChange) {
		return (event) => {
			if (event.button !== 0) return;
			onMouseDown?.(onChange);
		};
	}
	return /* @__PURE__ */ React.createElement("div", {
		className: styles$54.Spinner,
		onClick,
		"aria-hidden": true,
		ref
	}, /* @__PURE__ */ React.createElement("div", {
		role: "button",
		className: styles$54.Segment,
		tabIndex: -1,
		onClick: handleStep(1),
		onMouseDown: handleMouseDown(handleStep(1)),
		onMouseUp,
		onBlur
	}, /* @__PURE__ */ React.createElement("div", { className: styles$54.SpinnerIcon }, /* @__PURE__ */ React.createElement(Icon, { source: SvgChevronUpIcon }))), /* @__PURE__ */ React.createElement("div", {
		role: "button",
		className: styles$54.Segment,
		tabIndex: -1,
		onClick: handleStep(-1),
		onMouseDown: handleMouseDown(handleStep(-1)),
		onMouseUp,
		onBlur
	}, /* @__PURE__ */ React.createElement("div", { className: styles$54.SpinnerIcon }, /* @__PURE__ */ React.createElement(Icon, { source: SvgChevronDownIcon }))));
});
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/TextField/components/Resizer/Resizer.js
function Resizer({ contents, currentHeight: currentHeightProp = null, minimumLines, onHeightChange }) {
	const contentNode = useRef(null);
	const minimumLinesNode = useRef(null);
	const animationFrame = useRef();
	const currentHeight = useRef(currentHeightProp);
	if (currentHeightProp !== currentHeight.current) currentHeight.current = currentHeightProp;
	useEffect(() => {
		return () => {
			if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
		};
	}, []);
	const minimumLinesMarkup = minimumLines ? /* @__PURE__ */ React.createElement("div", {
		ref: minimumLinesNode,
		className: styles$54.DummyInput,
		dangerouslySetInnerHTML: { __html: getContentsForMinimumLines(minimumLines) }
	}) : null;
	const handleHeightCheck = useCallback(() => {
		if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
		animationFrame.current = requestAnimationFrame(() => {
			if (!contentNode.current || !minimumLinesNode.current) return;
			const newHeight = Math.max(contentNode.current.offsetHeight, minimumLinesNode.current.offsetHeight);
			if (newHeight !== currentHeight.current) onHeightChange(newHeight);
		});
	}, [onHeightChange]);
	useIsomorphicLayoutEffect(() => {
		handleHeightCheck();
	});
	return /* @__PURE__ */ React.createElement("div", {
		"aria-hidden": true,
		className: styles$54.Resizer
	}, /* @__PURE__ */ React.createElement(EventListener, {
		event: "resize",
		handler: handleHeightCheck
	}), /* @__PURE__ */ React.createElement("div", {
		ref: contentNode,
		className: styles$54.DummyInput,
		dangerouslySetInnerHTML: { __html: getFinalContents(contents) }
	}), minimumLinesMarkup);
}
var ENTITIES_TO_REPLACE = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\n": "<br>",
	"\r": ""
};
var REPLACE_REGEX = new RegExp(`[${Object.keys(ENTITIES_TO_REPLACE).join()}]`, "g");
function replaceEntity(entity) {
	return ENTITIES_TO_REPLACE[entity];
}
function getContentsForMinimumLines(minimumLines) {
	let content = "";
	for (let line = 0; line < minimumLines; line++) content += "<br>";
	return content;
}
function getFinalContents(contents) {
	return contents ? `${contents.replace(REPLACE_REGEX, replaceEntity)}<br>` : "<br>";
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/TextField/TextField.js
function TextField({ prefix, suffix, verticalContent, placeholder, value = "", helpText, label, labelAction, labelHidden, disabled, clearButton, readOnly, autoFocus, focused, multiline, error, connectedRight, connectedLeft, type = "text", name, id: idProp, role, step, largeStep, autoComplete, max, maxLength, maxHeight, min, minLength, pattern, inputMode, spellCheck, ariaOwns, ariaControls, ariaExpanded, ariaActiveDescendant, ariaAutocomplete, showCharacterCount, align, requiredIndicator, monospaced, selectTextOnFocus, suggestion, variant = "inherit", size = "medium", onClearButtonClick, onChange, onSpinnerChange, onFocus, onBlur, tone, autoSize, loading }) {
	const i18n = useI18n();
	const [height, setHeight] = useState(null);
	const [focus, setFocus] = useState(Boolean(focused));
	const isAfterInitial = useIsAfterInitialMount();
	const uniqId = useId();
	const id = idProp ?? uniqId;
	const textFieldRef = useRef(null);
	const inputRef = useRef(null);
	const textAreaRef = useRef(null);
	const prefixRef = useRef(null);
	const suffixRef = useRef(null);
	const loadingRef = useRef(null);
	const verticalContentRef = useRef(null);
	const buttonPressTimer = useRef();
	const spinnerRef = useRef(null);
	const getInputRef = useCallback(() => {
		return multiline ? textAreaRef.current : inputRef.current;
	}, [multiline]);
	useEffect(() => {
		const input = getInputRef();
		if (!input || focused === void 0) return;
		focused ? input.focus() : input.blur();
	}, [
		focused,
		verticalContent,
		getInputRef
	]);
	useEffect(() => {
		const input = inputRef.current;
		if (!input || !(type === "text" || type === "tel" || type === "search" || type === "url" || type === "password") || !suggestion) return;
		input.setSelectionRange(value.length, suggestion.length);
	}, [
		focus,
		value,
		type,
		suggestion
	]);
	const normalizedValue = suggestion ? suggestion : value;
	const normalizedStep = step != null ? step : 1;
	const normalizedMax = max != null ? max : Infinity;
	const normalizedMin = min != null ? min : -Infinity;
	const className = classNames(styles$54.TextField, Boolean(normalizedValue) && styles$54.hasValue, disabled && styles$54.disabled, readOnly && styles$54.readOnly, error && styles$54.error, tone && styles$54[variationName("tone", tone)], multiline && styles$54.multiline, focus && !disabled && styles$54.focus, variant !== "inherit" && styles$54[variant], size === "slim" && styles$54.slim);
	const inputType = type === "currency" ? "text" : type;
	const isNumericType = type === "number" || type === "integer";
	const iconPrefix = /* @__PURE__ */ React.isValidElement(prefix) && prefix.type === Icon;
	const prefixMarkup = prefix ? /* @__PURE__ */ React.createElement("div", {
		className: classNames(styles$54.Prefix, iconPrefix && styles$54.PrefixIcon),
		id: `${id}-Prefix`,
		ref: prefixRef
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd"
	}, prefix)) : null;
	const suffixMarkup = suffix ? /* @__PURE__ */ React.createElement("div", {
		className: styles$54.Suffix,
		id: `${id}-Suffix`,
		ref: suffixRef
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd"
	}, suffix)) : null;
	const loadingMarkup = loading ? /* @__PURE__ */ React.createElement("div", {
		className: styles$54.Loading,
		id: `${id}-Loading`,
		ref: loadingRef
	}, /* @__PURE__ */ React.createElement(Spinner$1, { size: "small" })) : null;
	let characterCountMarkup = null;
	if (showCharacterCount) {
		const characterCount = normalizedValue.length;
		const characterCountLabel = maxLength ? i18n.translate("Polaris.TextField.characterCountWithMaxLength", {
			count: characterCount,
			limit: maxLength
		}) : i18n.translate("Polaris.TextField.characterCount", { count: characterCount });
		const characterCountClassName = classNames(styles$54.CharacterCount, multiline && styles$54.AlignFieldBottom);
		const characterCountText = !maxLength ? characterCount : `${characterCount}/${maxLength}`;
		characterCountMarkup = /* @__PURE__ */ React.createElement("div", {
			id: `${id}-CharacterCounter`,
			className: characterCountClassName,
			"aria-label": characterCountLabel,
			"aria-live": focus ? "polite" : "off",
			"aria-atomic": "true",
			onClick: handleClickChild
		}, /* @__PURE__ */ React.createElement(Text, {
			as: "span",
			variant: "bodyMd"
		}, characterCountText));
	}
	const clearButtonMarkup = clearButton && normalizedValue !== "" ? /* @__PURE__ */ React.createElement("button", {
		type: "button",
		className: styles$54.ClearButton,
		onClick: handleClearButtonPress,
		disabled
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		visuallyHidden: true
	}, i18n.translate("Polaris.Common.clear")), /* @__PURE__ */ React.createElement(Icon, {
		source: SvgXCircleIcon,
		tone: "base"
	})) : null;
	const handleNumberChange = useCallback((steps, stepAmount = normalizedStep) => {
		if (onChange == null && onSpinnerChange == null) return;
		const dpl = (num) => (num.toString().split(".")[1] || []).length;
		const numericValue = value ? parseFloat(value) : 0;
		if (isNaN(numericValue)) return;
		const decimalPlaces = type === "integer" ? 0 : Math.max(dpl(numericValue), dpl(stepAmount));
		const newValue = Math.min(Number(normalizedMax), Math.max(numericValue + steps * stepAmount, Number(normalizedMin)));
		if (onSpinnerChange != null) onSpinnerChange(String(newValue.toFixed(decimalPlaces)), id);
		else if (onChange != null) onChange(String(newValue.toFixed(decimalPlaces)), id);
	}, [
		id,
		normalizedMax,
		normalizedMin,
		onChange,
		onSpinnerChange,
		normalizedStep,
		type,
		value
	]);
	const handleSpinnerButtonRelease = useCallback(() => {
		clearTimeout(buttonPressTimer.current);
	}, []);
	const handleSpinnerButtonPress = useCallback((onChange) => {
		const minInterval = 50;
		const decrementBy = 10;
		let interval = 200;
		const onChangeInterval = () => {
			if (interval > minInterval) interval -= decrementBy;
			onChange(0);
			buttonPressTimer.current = window.setTimeout(onChangeInterval, interval);
		};
		buttonPressTimer.current = window.setTimeout(onChangeInterval, interval);
		document.addEventListener("mouseup", handleSpinnerButtonRelease, { once: true });
	}, [handleSpinnerButtonRelease]);
	const spinnerMarkup = isNumericType && step !== 0 && !disabled && !readOnly ? /* @__PURE__ */ React.createElement(Spinner, {
		onClick: handleClickChild,
		onChange: handleNumberChange,
		onMouseDown: handleSpinnerButtonPress,
		onMouseUp: handleSpinnerButtonRelease,
		ref: spinnerRef,
		onBlur: handleOnBlur
	}) : null;
	const style = multiline && height ? {
		height,
		maxHeight
	} : null;
	const handleExpandingResize = useCallback((height) => {
		setHeight(height);
	}, []);
	const resizer = multiline && isAfterInitial ? /* @__PURE__ */ React.createElement(Resizer, {
		contents: normalizedValue || placeholder,
		currentHeight: height,
		minimumLines: typeof multiline === "number" ? multiline : 1,
		onHeightChange: handleExpandingResize
	}) : null;
	const describedBy = [];
	if (error) describedBy.push(`${id}Error`);
	if (helpText) describedBy.push(helpTextID$1(id));
	if (showCharacterCount) describedBy.push(`${id}-CharacterCounter`);
	const labelledBy = [];
	if (prefix) labelledBy.push(`${id}-Prefix`);
	if (suffix) labelledBy.push(`${id}-Suffix`);
	if (verticalContent) labelledBy.push(`${id}-VerticalContent`);
	labelledBy.unshift(labelID(id));
	const inputClassName = classNames(styles$54.Input, align && styles$54[variationName("Input-align", align)], suffix && styles$54["Input-suffixed"], clearButton && styles$54["Input-hasClearButton"], monospaced && styles$54.monospaced, suggestion && styles$54.suggestion, autoSize && styles$54["Input-autoSize"]);
	const handleOnFocus = (event) => {
		setFocus(true);
		if (selectTextOnFocus && !suggestion) getInputRef()?.select();
		if (onFocus) onFocus(event);
	};
	useEventListener("wheel", handleOnWheel, inputRef);
	function handleOnWheel(event) {
		if (document.activeElement === event.target && isNumericType) event.stopPropagation();
	}
	const input = /* @__PURE__ */ createElement(multiline ? "textarea" : "input", {
		name,
		id,
		disabled,
		readOnly,
		role,
		autoFocus,
		value: normalizedValue,
		placeholder,
		style,
		autoComplete,
		className: inputClassName,
		ref: multiline ? textAreaRef : inputRef,
		min,
		max,
		step,
		minLength,
		maxLength,
		spellCheck,
		pattern,
		inputMode,
		type: inputType,
		rows: getRows(multiline),
		size: autoSize ? 1 : void 0,
		"aria-describedby": describedBy.length ? describedBy.join(" ") : void 0,
		"aria-labelledby": labelledBy.join(" "),
		"aria-invalid": Boolean(error),
		"aria-owns": ariaOwns,
		"aria-activedescendant": ariaActiveDescendant,
		"aria-autocomplete": ariaAutocomplete,
		"aria-controls": ariaControls,
		"aria-expanded": ariaExpanded,
		"aria-required": requiredIndicator,
		...normalizeAriaMultiline(multiline),
		onFocus: handleOnFocus,
		onBlur: handleOnBlur,
		onClick: handleClickChild,
		onKeyPress: handleKeyPress,
		onKeyDown: handleKeyDown,
		onChange: !suggestion ? handleChange : void 0,
		onInput: suggestion ? handleChange : void 0,
		"data-1p-ignore": autoComplete === "off" || void 0,
		"data-lpignore": autoComplete === "off" || void 0,
		"data-form-type": autoComplete === "off" ? "other" : void 0
	});
	const inputWithVerticalContentMarkup = verticalContent ? /* @__PURE__ */ React.createElement("div", {
		className: styles$54.VerticalContent,
		id: `${id}-VerticalContent`,
		ref: verticalContentRef,
		onClick: handleClickChild
	}, verticalContent, input) : null;
	const inputMarkup = verticalContent ? inputWithVerticalContentMarkup : input;
	const backdropMarkup = /* @__PURE__ */ React.createElement("div", { className: classNames(styles$54.Backdrop, connectedLeft && styles$54["Backdrop-connectedLeft"], connectedRight && styles$54["Backdrop-connectedRight"]) });
	const inputAndSuffixMarkup = autoSize ? /* @__PURE__ */ React.createElement("div", { className: styles$54.InputAndSuffixWrapper }, /* @__PURE__ */ React.createElement("div", {
		className: classNames(styles$54.AutoSizeWrapper, suffix && styles$54.AutoSizeWrapperWithSuffix),
		"data-auto-size-value": value || placeholder
	}, inputMarkup), suffixMarkup) : /* @__PURE__ */ React.createElement(React.Fragment, null, inputMarkup, suffixMarkup);
	return /* @__PURE__ */ React.createElement(Labelled, {
		label,
		id,
		error,
		action: labelAction,
		labelHidden,
		helpText,
		requiredIndicator,
		disabled,
		readOnly
	}, /* @__PURE__ */ React.createElement(Connected, {
		left: connectedLeft,
		right: connectedRight
	}, /* @__PURE__ */ React.createElement("div", {
		className,
		onClick: handleClick,
		ref: textFieldRef
	}, prefixMarkup, inputAndSuffixMarkup, characterCountMarkup, loadingMarkup, clearButtonMarkup, spinnerMarkup, backdropMarkup, resizer)));
	function handleChange(event) {
		onChange && onChange(event.currentTarget.value, id);
	}
	function handleClick(event) {
		const { target } = event;
		const inputRefRole = inputRef?.current?.getAttribute("role");
		if (target === inputRef.current && inputRefRole === "combobox") {
			inputRef.current?.focus();
			handleOnFocus(event);
			return;
		}
		if (isPrefixOrSuffix(target) || isVerticalContent(target) || isInput(target) || isSpinner(target) || isLoadingSpinner(target) || focus) return;
		getInputRef()?.focus();
	}
	function handleClickChild(event) {
		if (!isSpinner(event.target) && !isInput(event.target)) event.stopPropagation();
		if (isPrefixOrSuffix(event.target) || isVerticalContent(event.target) || isInput(event.target) || isLoadingSpinner(event.target) || focus) return;
		setFocus(true);
		getInputRef()?.focus();
	}
	function handleClearButtonPress() {
		onClearButtonClick && onClearButtonClick(id);
	}
	function handleKeyPress(event) {
		const { key, which } = event;
		if (!isNumericType || which === Key.Enter || type === "number" && /[\d.,eE+-]$/.test(key) || type === "integer" && /[\deE+-]$/.test(key)) return;
		event.preventDefault();
	}
	function handleKeyDown(event) {
		if (!isNumericType) return;
		const { key, which } = event;
		if (type === "integer" && (key === "ArrowUp" || which === Key.UpArrow)) {
			handleNumberChange(1);
			event.preventDefault();
		}
		if (type === "integer" && (key === "ArrowDown" || which === Key.DownArrow)) {
			handleNumberChange(-1);
			event.preventDefault();
		}
		if ((which === Key.Home || key === "Home") && min !== void 0) {
			if (onSpinnerChange != null) onSpinnerChange(String(min), id);
			else if (onChange != null) onChange(String(min), id);
		}
		if ((which === Key.End || key === "End") && max !== void 0) {
			if (onSpinnerChange != null) onSpinnerChange(String(max), id);
			else if (onChange != null) onChange(String(max), id);
		}
		if ((which === Key.PageUp || key === "PageUp") && largeStep !== void 0) handleNumberChange(1, largeStep);
		if ((which === Key.PageDown || key === "PageDown") && largeStep !== void 0) handleNumberChange(-1, largeStep);
	}
	function handleOnBlur(event) {
		setFocus(false);
		if (textFieldRef.current?.contains(event?.relatedTarget)) return;
		if (onBlur) onBlur(event);
	}
	function isInput(target) {
		const input = getInputRef();
		return target instanceof HTMLElement && input && (input.contains(target) || input.contains(document.activeElement));
	}
	function isPrefixOrSuffix(target) {
		return target instanceof Element && (prefixRef.current && prefixRef.current.contains(target) || suffixRef.current && suffixRef.current.contains(target));
	}
	function isSpinner(target) {
		return target instanceof Element && spinnerRef.current && spinnerRef.current.contains(target);
	}
	function isLoadingSpinner(target) {
		return target instanceof Element && loadingRef.current && loadingRef.current.contains(target);
	}
	function isVerticalContent(target) {
		return target instanceof Element && verticalContentRef.current && (verticalContentRef.current.contains(target) || verticalContentRef.current.contains(document.activeElement));
	}
}
function getRows(multiline) {
	if (!multiline) return void 0;
	return typeof multiline === "number" ? multiline : 1;
}
function normalizeAriaMultiline(multiline) {
	if (!multiline) return void 0;
	return Boolean(multiline) || typeof multiline === "number" && multiline > 0 ? { "aria-multiline": true } : void 0;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionList/ActionList.js
var FILTER_ACTIONS_THRESHOLD = 8;
function ActionList({ items, sections = [], actionRole, allowFiltering, onActionAnyItem, filterLabel }) {
	const i18n = useI18n();
	const filterActions = useContext(FilterActionsContext);
	let finalSections = [];
	const actionListRef = useRef(null);
	const [searchText, setSearchText] = useState("");
	if (items) finalSections = [{ items }, ...sections];
	else if (sections) finalSections = sections;
	const isFilterable = finalSections?.some((section) => section.items.some((item) => typeof item.content === "string"));
	const hasMultipleSections = finalSections.length > 1;
	const elementRole = hasMultipleSections && actionRole === "menuitem" ? "menu" : void 0;
	const elementTabIndex = hasMultipleSections && actionRole === "menuitem" ? -1 : void 0;
	const filteredSections = finalSections?.map((section) => ({
		...section,
		items: section.items.filter(({ content }) => typeof content === "string" ? content?.toLowerCase().includes(searchText.toLowerCase()) : content)
	}));
	const sectionMarkup = filteredSections.map((section, index) => {
		return section.items.length > 0 ? /* @__PURE__ */ React.createElement(Section$3, {
			key: typeof section.title === "string" ? section.title : index,
			section,
			hasMultipleSections,
			actionRole,
			onActionAnyItem,
			isFirst: index === 0
		}) : null;
	});
	const handleFocusPreviousItem = (evt) => {
		evt.preventDefault();
		if (actionListRef.current && evt.target) {
			if (actionListRef.current.contains(evt.target)) wrapFocusPreviousFocusableMenuItem(actionListRef.current, evt.target);
		}
	};
	const handleFocusNextItem = (evt) => {
		evt.preventDefault();
		if (actionListRef.current && evt.target) {
			if (actionListRef.current.contains(evt.target)) wrapFocusNextFocusableMenuItem(actionListRef.current, evt.target);
		}
	};
	const listeners = actionRole === "menuitem" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(KeypressListener, {
		keyEvent: "keydown",
		keyCode: Key.DownArrow,
		handler: handleFocusNextItem
	}), /* @__PURE__ */ React.createElement(KeypressListener, {
		keyEvent: "keydown",
		keyCode: Key.UpArrow,
		handler: handleFocusPreviousItem
	})) : null;
	const totalFilteredActions = useMemo(() => {
		return filteredSections?.reduce((acc, section) => acc + section.items.length, 0) || 0;
	}, [filteredSections]);
	const hasManyActions = (finalSections?.reduce((acc, section) => acc + section.items.length, 0) || 0) >= FILTER_ACTIONS_THRESHOLD;
	return /* @__PURE__ */ React.createElement(React.Fragment, null, (allowFiltering || filterActions) && hasManyActions && isFilterable && /* @__PURE__ */ React.createElement(Box, {
		padding: "200",
		paddingBlockEnd: totalFilteredActions > 0 ? "0" : "200"
	}, /* @__PURE__ */ React.createElement(TextField, {
		clearButton: true,
		labelHidden: true,
		label: filterLabel ? filterLabel : i18n.translate("Polaris.ActionList.SearchField.placeholder"),
		placeholder: filterLabel ? filterLabel : i18n.translate("Polaris.ActionList.SearchField.placeholder"),
		autoComplete: "off",
		value: searchText,
		onChange: (value) => setSearchText(value),
		prefix: /* @__PURE__ */ React.createElement(Icon, { source: SvgSearchIcon }),
		onClearButtonClick: () => setSearchText("")
	})), /* @__PURE__ */ React.createElement(Box, {
		as: hasMultipleSections ? "ul" : "div",
		ref: actionListRef,
		role: elementRole,
		tabIndex: elementTabIndex
	}, listeners, sectionMarkup));
}
ActionList.Item = Item$6;
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/ActionMenu.css.js
var styles$49 = { "ActionMenu": "Polaris-ActionMenu" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/RollupActions/RollupActions.css.js
var styles$48 = { "RollupActivator": "Polaris-ActionMenu-RollupActions__RollupActivator" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Popover/set-activator-attributes.js
function setActivatorAttributes(activator, { id, active = false, ariaHaspopup, activatorDisabled = false }) {
	if (!activatorDisabled) activator.tabIndex = activator.tabIndex || 0;
	activator.setAttribute("aria-controls", id);
	activator.setAttribute("aria-owns", id);
	activator.setAttribute("aria-expanded", String(active));
	activator.setAttribute("data-state", active ? "open" : "closed");
	if (ariaHaspopup != null) activator.setAttribute("aria-haspopup", String(ariaHaspopup));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/components.js
function wrapWithComponent(element, Component, props) {
	if (element == null) return null;
	return isElementOfType(element, Component) ? element : /* @__PURE__ */ React.createElement(Component, props, element);
}
var isComponent = process.env.NODE_ENV === "development" ? hotReloadComponentCheck : (AComponent, AnotherComponent) => AComponent === AnotherComponent;
function isElementOfType(element, Component) {
	if (element == null || !/* @__PURE__ */ isValidElement(element) || typeof element.type === "string") return false;
	const { type: defaultType } = element;
	const type = element.props?.__type__ || defaultType;
	return (Array.isArray(Component) ? Component : [Component]).some((AComponent) => typeof type !== "string" && isComponent(AComponent, type));
}
function elementChildren(children, predicate = () => true) {
	return Children.toArray(children).filter((child) => /* @__PURE__ */ isValidElement(child) && predicate(child));
}
function ConditionalWrapper({ condition, wrapper, children }) {
	return condition ? wrapper(children) : children;
}
function ConditionalRender({ condition, children }) {
	return condition ? children : null;
}
function hotReloadComponentCheck(AComponent, AnotherComponent) {
	const componentName = AComponent.name;
	const anotherComponentName = AnotherComponent.displayName;
	return AComponent === AnotherComponent || Boolean(componentName) && componentName === anotherComponentName;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Popover/Popover.css.js
var styles$47 = {
	"Popover": "Polaris-Popover",
	"PopoverOverlay": "Polaris-Popover__PopoverOverlay",
	"PopoverOverlay-noAnimation": "Polaris-Popover__PopoverOverlay--noAnimation",
	"PopoverOverlay-entering": "Polaris-Popover__PopoverOverlay--entering",
	"PopoverOverlay-open": "Polaris-Popover__PopoverOverlay--open",
	"measuring": "Polaris-Popover--measuring",
	"PopoverOverlay-exiting": "Polaris-Popover__PopoverOverlay--exiting",
	"fullWidth": "Polaris-Popover--fullWidth",
	"Content": "Polaris-Popover__Content",
	"positionedAbove": "Polaris-Popover--positionedAbove",
	"positionedCover": "Polaris-Popover--positionedCover",
	"ContentContainer": "Polaris-Popover__ContentContainer",
	"Content-fullHeight": "Polaris-Popover__Content--fullHeight",
	"Content-fluidContent": "Polaris-Popover__Content--fluidContent",
	"Pane": "Polaris-Popover__Pane",
	"Pane-fixed": "Polaris-Popover__Pane--fixed",
	"Pane-subdued": "Polaris-Popover__Pane--subdued",
	"Pane-captureOverscroll": "Polaris-Popover__Pane--captureOverscroll",
	"Section": "Polaris-Popover__Section",
	"FocusTracker": "Polaris-Popover__FocusTracker",
	"PopoverOverlay-hideOnPrint": "Polaris-Popover__PopoverOverlay--hideOnPrint"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Popover/components/Section/Section.js
function Section$2({ children }) {
	return /* @__PURE__ */ React.createElement("div", { className: styles$47.Section }, /* @__PURE__ */ React.createElement(Box, {
		paddingInlineStart: "300",
		paddingInlineEnd: "300",
		paddingBlockStart: "200",
		paddingBlockEnd: "150"
	}, children));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Popover/components/Pane/Pane.js
function Pane({ captureOverscroll = false, fixed, sectioned, children, height, maxHeight, minHeight, subdued, onScrolledToBottom }) {
	const className = classNames(styles$47.Pane, fixed && styles$47["Pane-fixed"], subdued && styles$47["Pane-subdued"], captureOverscroll && styles$47["Pane-captureOverscroll"]);
	const content = sectioned ? wrapWithComponent(children, Section$2, {}) : children;
	const style = {
		height,
		maxHeight,
		minHeight
	};
	return fixed ? /* @__PURE__ */ React.createElement("div", {
		style,
		className
	}, content) : /* @__PURE__ */ React.createElement(Scrollable, {
		shadow: true,
		className,
		style,
		onScrolledToBottom,
		scrollbarWidth: "thin"
	}, content);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Popover/components/PopoverOverlay/PopoverOverlay.js
var PopoverCloseSource = /* @__PURE__ */ function(PopoverCloseSource) {
	PopoverCloseSource[PopoverCloseSource["Click"] = 0] = "Click";
	PopoverCloseSource[PopoverCloseSource["EscapeKeypress"] = 1] = "EscapeKeypress";
	PopoverCloseSource[PopoverCloseSource["FocusOut"] = 2] = "FocusOut";
	PopoverCloseSource[PopoverCloseSource["ScrollOut"] = 3] = "ScrollOut";
	return PopoverCloseSource;
}({});
var TransitionStatus$1 = /* @__PURE__ */ function(TransitionStatus) {
	TransitionStatus["Entering"] = "entering";
	TransitionStatus["Entered"] = "entered";
	TransitionStatus["Exiting"] = "exiting";
	TransitionStatus["Exited"] = "exited";
	return TransitionStatus;
}(TransitionStatus$1 || {});
var PopoverOverlay = class extends PureComponent {
	constructor(props) {
		super(props);
		this.state = { transitionStatus: this.props.active ? TransitionStatus$1.Entering : TransitionStatus$1.Exited };
		this.contentNode = /* @__PURE__ */ createRef();
		this.renderPopover = (overlayDetails) => {
			const { measuring, desiredHeight, positioning } = overlayDetails;
			const { id, children, sectioned, fullWidth, fullHeight, fluidContent, hideOnPrint, autofocusTarget, captureOverscroll } = this.props;
			const isCovering = positioning === "cover";
			const className = classNames(styles$47.Popover, measuring && styles$47.measuring, (fullWidth || isCovering) && styles$47.fullWidth, hideOnPrint && styles$47["PopoverOverlay-hideOnPrint"], positioning && styles$47[variationName("positioned", positioning)]);
			const contentStyles = measuring ? void 0 : { height: desiredHeight };
			const contentClassNames = classNames(styles$47.Content, fullHeight && styles$47["Content-fullHeight"], fluidContent && styles$47["Content-fluidContent"]);
			const { window } = this.state;
			return /* @__PURE__ */ React.createElement("div", Object.assign({ className }, overlay.props), /* @__PURE__ */ React.createElement(EventListener, {
				event: "click",
				handler: this.handleClick,
				window
			}), /* @__PURE__ */ React.createElement(EventListener, {
				event: "touchstart",
				handler: this.handleClick,
				window
			}), /* @__PURE__ */ React.createElement(KeypressListener, {
				keyCode: Key.Escape,
				handler: this.handleEscape,
				document: window?.document
			}), /* @__PURE__ */ React.createElement("div", {
				className: styles$47.FocusTracker,
				tabIndex: 0,
				onFocus: this.handleFocusFirstItem
			}), /* @__PURE__ */ React.createElement("div", { className: styles$47.ContentContainer }, /* @__PURE__ */ React.createElement("div", {
				id,
				tabIndex: autofocusTarget === "none" ? void 0 : -1,
				className: contentClassNames,
				style: contentStyles,
				ref: this.contentNode
			}, renderPopoverContent(children, {
				captureOverscroll,
				sectioned
			}))), /* @__PURE__ */ React.createElement("div", {
				className: styles$47.FocusTracker,
				tabIndex: 0,
				onFocus: this.handleFocusLastItem
			}));
		};
		this.handleClick = (event) => {
			const target = event.target;
			const { contentNode, props: { activator, onClose, preventCloseOnChildOverlayClick } } = this;
			const composedPath = event.composedPath();
			const wasDescendant = preventCloseOnChildOverlayClick ? wasPolarisPortalDescendant(composedPath, this.context.container) : wasContentNodeDescendant(composedPath, contentNode);
			const isActivatorDescendant = nodeContainsDescendant(activator, target);
			if (wasDescendant || isActivatorDescendant || this.state.transitionStatus !== TransitionStatus$1.Entered) return;
			onClose(PopoverCloseSource.Click);
		};
		this.handleScrollOut = () => {
			this.props.onClose(PopoverCloseSource.ScrollOut);
		};
		this.handleEscape = (event) => {
			const target = event.target;
			const { contentNode, props: { activator } } = this;
			const wasDescendant = wasContentNodeDescendant(event.composedPath(), contentNode);
			const isActivatorDescendant = nodeContainsDescendant(activator, target);
			if (wasDescendant || isActivatorDescendant) this.props.onClose(PopoverCloseSource.EscapeKeypress);
		};
		this.handleFocusFirstItem = () => {
			this.props.onClose(PopoverCloseSource.FocusOut);
		};
		this.handleFocusLastItem = () => {
			this.props.onClose(PopoverCloseSource.FocusOut);
		};
		this.overlayRef = /* @__PURE__ */ createRef();
	}
	forceUpdatePosition() {
		this.overlayRef.current?.forceUpdatePosition();
	}
	changeTransitionStatus(transitionStatus, cb) {
		this.setState({ transitionStatus }, cb);
		this.contentNode.current && this.contentNode.current.getBoundingClientRect();
	}
	componentDidMount() {
		if (this.props.active) {
			this.focusContent();
			this.changeTransitionStatus(TransitionStatus$1.Entered);
		}
		this.observer = new ResizeObserver(() => {
			this.setState({ 
			/**
			* This is a workaround to enable event listeners to be
			* re-attached when moving from one document to another
			* when using a React portal across iframes.
			* Using a resize observer works because when the clientWidth
			* will go from 0 to the real width after the activator
			* gets rendered in its new place.
			*/
window: this.props.activator.ownerDocument.defaultView });
		});
		this.observer.observe(this.props.activator);
	}
	componentDidUpdate(oldProps) {
		if (this.props.active && !oldProps.active) {
			this.focusContent();
			this.changeTransitionStatus(TransitionStatus$1.Entering, () => {
				this.clearTransitionTimeout();
				this.enteringTimer = window.setTimeout(() => {
					this.setState({ transitionStatus: TransitionStatus$1.Entered });
				}, parseInt(themeDefault.motion["motion-duration-100"], 10));
			});
		}
		if (!this.props.active && oldProps.active) {
			this.clearTransitionTimeout();
			this.setState({ transitionStatus: TransitionStatus$1.Exited });
		}
		if (this.props.activator !== oldProps.activator) {
			this.observer?.unobserve(oldProps.activator);
			this.observer?.observe(this.props.activator);
		}
	}
	componentWillUnmount() {
		this.clearTransitionTimeout();
		this.observer?.disconnect();
	}
	render() {
		const { active, activator, fullWidth, preferredPosition = "below", preferredAlignment = "center", preferInputActivator = true, fixed, zIndexOverride } = this.props;
		const { transitionStatus } = this.state;
		if (transitionStatus === TransitionStatus$1.Exited && !active) return null;
		const className = classNames(styles$47.PopoverOverlay, transitionStatus === TransitionStatus$1.Entering && styles$47["PopoverOverlay-entering"], transitionStatus === TransitionStatus$1.Entered && styles$47["PopoverOverlay-open"], transitionStatus === TransitionStatus$1.Exiting && styles$47["PopoverOverlay-exiting"], preferredPosition === "cover" && styles$47["PopoverOverlay-noAnimation"]);
		return /* @__PURE__ */ React.createElement(PositionedOverlay, {
			ref: this.overlayRef,
			fullWidth,
			active,
			activator,
			preferInputActivator,
			preferredPosition,
			preferredAlignment,
			render: this.renderPopover.bind(this),
			fixed,
			onScrollOut: this.handleScrollOut,
			classNames: className,
			zIndexOverride
		});
	}
	clearTransitionTimeout() {
		if (this.enteringTimer) window.clearTimeout(this.enteringTimer);
	}
	focusContent() {
		const { autofocusTarget = "container" } = this.props;
		if (autofocusTarget === "none" || this.contentNode == null) return;
		requestAnimationFrame(() => {
			if (this.contentNode.current == null) return;
			const focusableChild = findFirstKeyboardFocusableNode(this.contentNode.current);
			if (focusableChild && autofocusTarget === "first-node") focusableChild.focus({ preventScroll: process.env.NODE_ENV === "development" });
			else this.contentNode.current.focus({ preventScroll: process.env.NODE_ENV === "development" });
		});
	}
};
PopoverOverlay.contextType = PortalsManagerContext;
function renderPopoverContent(children, props) {
	const childrenArray = Children.toArray(children);
	if (isElementOfType(childrenArray[0], Pane)) return childrenArray;
	return wrapWithComponent(childrenArray, Pane, props);
}
function nodeContainsDescendant(rootNode, descendant) {
	if (rootNode === descendant) return true;
	let parent = descendant.parentNode;
	while (parent != null) {
		if (parent === rootNode) return true;
		parent = parent.parentNode;
	}
	return false;
}
function wasContentNodeDescendant(composedPath, contentNode) {
	return contentNode.current != null && composedPath.includes(contentNode.current);
}
function wasPolarisPortalDescendant(composedPath, portalsContainerElement) {
	return composedPath.some((eventTarget) => eventTarget instanceof Node && portalsContainerElement?.contains(eventTarget));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Popover/Popover.js
var PopoverComponent = /* @__PURE__ */ forwardRef(function Popover({ activatorWrapper = "div", children, onClose, activator, preventFocusOnClose, active, fixed, ariaHaspopup, preferInputActivator = true, zIndexOverride, ...rest }, ref) {
	const [isDisplayed, setIsDisplay] = useState(false);
	const [activatorNode, setActivatorNode] = useState();
	const overlayRef = useRef(null);
	const activatorContainer = useRef(null);
	const WrapperComponent = activatorWrapper;
	const id = useId();
	function forceUpdatePosition() {
		overlayRef.current?.forceUpdatePosition();
	}
	const handleClose = (source) => {
		onClose(source);
		if (activatorContainer.current == null || preventFocusOnClose) return;
		if (source === PopoverCloseSource.FocusOut && activatorNode) {
			const focusableActivator = findFirstFocusableNodeIncludingDisabled(activatorNode) || findFirstFocusableNodeIncludingDisabled(activatorContainer.current) || activatorContainer.current;
			if (!focusNextFocusableNode(focusableActivator, isInPortal)) focusableActivator.focus();
		} else if (source === PopoverCloseSource.EscapeKeypress && activatorNode) {
			const focusableActivator = findFirstFocusableNodeIncludingDisabled(activatorNode) || findFirstFocusableNodeIncludingDisabled(activatorContainer.current) || activatorContainer.current;
			if (focusableActivator) focusableActivator.focus();
			else focusNextFocusableNode(focusableActivator, isInPortal);
		}
	};
	useImperativeHandle(ref, () => {
		return {
			forceUpdatePosition,
			close: (target = "activator") => {
				handleClose(target === "activator" ? PopoverCloseSource.EscapeKeypress : PopoverCloseSource.FocusOut);
			}
		};
	});
	const setAccessibilityAttributes = useCallback(() => {
		if (activatorContainer.current == null) return;
		const focusableActivator = findFirstFocusableNodeIncludingDisabled(activatorContainer.current) || activatorContainer.current;
		setActivatorAttributes(focusableActivator, {
			id,
			active,
			ariaHaspopup,
			activatorDisabled: "disabled" in focusableActivator && Boolean(focusableActivator.disabled)
		});
	}, [
		id,
		active,
		ariaHaspopup
	]);
	useEffect(() => {
		function setDisplayState() {
			/**
			* This is a workaround to prevent rendering the Popover when the content is moved into
			* a React portal that hasn't been rendered. We don't want to render the Popover in this
			* case because the auto-focus logic will break. We wait until the activatorContainer is
			* displayed, which is when it has an offsetParent, or if the activatorContainer is the
			* body, if it has a clientWidth bigger than 0.
			* See: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
			*/
			setIsDisplay(Boolean(activatorContainer.current && (activatorContainer.current.offsetParent !== null || activatorContainer.current === activatorContainer.current.ownerDocument.body && activatorContainer.current.clientWidth > 0)));
		}
		if (!activatorContainer.current) return;
		const observer = new ResizeObserver(setDisplayState);
		observer.observe(activatorContainer.current);
		setDisplayState();
		return () => {
			observer.disconnect();
		};
	}, []);
	useEffect(() => {
		if (!activatorNode && activatorContainer.current) setActivatorNode(activatorContainer.current.firstElementChild);
		else if (activatorNode && activatorContainer.current && !activatorContainer.current.contains(activatorNode)) setActivatorNode(activatorContainer.current.firstElementChild);
		setAccessibilityAttributes();
	}, [activatorNode, setAccessibilityAttributes]);
	useEffect(() => {
		if (activatorNode && activatorContainer.current) setActivatorNode(activatorContainer.current.firstElementChild);
		setAccessibilityAttributes();
	}, [activatorNode, setAccessibilityAttributes]);
	const portal = activatorNode && isDisplayed ? /* @__PURE__ */ React.createElement(Portal, { idPrefix: "popover" }, /* @__PURE__ */ React.createElement(PopoverOverlay, Object.assign({
		ref: overlayRef,
		id,
		activator: activatorNode,
		preferInputActivator,
		onClose: handleClose,
		active,
		fixed,
		zIndexOverride
	}, rest), children)) : null;
	return /* @__PURE__ */ React.createElement(WrapperComponent, { ref: activatorContainer }, Children.only(activator), portal);
});
function isInPortal(element) {
	let parentElement = element.parentElement;
	while (parentElement) {
		if (parentElement.matches(portal.selector)) return false;
		parentElement = parentElement.parentElement;
	}
	return true;
}
var Popover = Object.assign(PopoverComponent, {
	Pane,
	Section: Section$2
});
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/RollupActions/RollupActions.js
function RollupActions({ accessibilityLabel, items = [], sections = [] }) {
	const i18n = useI18n();
	const { value: rollupOpen, toggle: toggleRollupOpen } = useToggle(false);
	if (items.length === 0 && sections.length === 0) return null;
	const activatorMarkup = /* @__PURE__ */ React.createElement("div", { className: styles$48.RollupActivator }, /* @__PURE__ */ React.createElement(Button, {
		icon: SvgMenuHorizontalIcon,
		accessibilityLabel: accessibilityLabel || i18n.translate("Polaris.ActionMenu.RollupActions.rollupButton"),
		onClick: toggleRollupOpen
	}));
	return /* @__PURE__ */ React.createElement(Popover, {
		active: rollupOpen,
		activator: activatorMarkup,
		preferredAlignment: "right",
		onClose: toggleRollupOpen,
		hideOnPrint: true
	}, /* @__PURE__ */ React.createElement(ActionList, {
		items,
		sections,
		onActionAnyItem: toggleRollupOpen
	}));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/Actions/Actions.css.js
var styles$46 = {
	"ActionsLayoutOuter": "Polaris-ActionMenu-Actions__ActionsLayoutOuter",
	"ActionsLayout": "Polaris-ActionMenu-Actions__ActionsLayout",
	"ActionsLayout--measuring": "Polaris-ActionMenu-Actions--actionsLayoutMeasuring",
	"ActionsLayoutMeasurer": "Polaris-ActionMenu-Actions__ActionsLayoutMeasurer"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/Actions/utilities.js
function getVisibleAndHiddenActionsIndices$1(actions = [], groups = [], disclosureWidth, actionsWidths, containerWidth) {
	const sumTabWidths = actionsWidths.reduce((sum, width) => sum + width, 0);
	const arrayOfActionsIndices = actions.map((_, index) => {
		return index;
	});
	const arrayOfGroupsIndices = groups.map((_, index) => {
		return index;
	});
	const visibleActions = [];
	const hiddenActions = [];
	const visibleGroups = [];
	const hiddenGroups = [];
	if (containerWidth > sumTabWidths) {
		visibleActions.push(...arrayOfActionsIndices);
		visibleGroups.push(...arrayOfGroupsIndices);
	} else {
		let accumulatedWidth = 0;
		arrayOfActionsIndices.forEach((currentActionsIndex) => {
			const currentActionsWidth = actionsWidths[currentActionsIndex];
			if (accumulatedWidth + currentActionsWidth >= containerWidth - disclosureWidth) {
				hiddenActions.push(currentActionsIndex);
				return;
			}
			visibleActions.push(currentActionsIndex);
			accumulatedWidth += currentActionsWidth;
		});
		arrayOfGroupsIndices.forEach((currentGroupsIndex) => {
			const currentActionsWidth = actionsWidths[currentGroupsIndex + actions.length];
			if (accumulatedWidth + currentActionsWidth >= containerWidth - disclosureWidth) {
				hiddenGroups.push(currentGroupsIndex);
				return;
			}
			visibleGroups.push(currentGroupsIndex);
			accumulatedWidth += currentActionsWidth;
		});
	}
	return {
		visibleActions,
		hiddenActions,
		visibleGroups,
		hiddenGroups
	};
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/MenuGroup/MenuGroup.css.js
var styles$45 = { "Details": "Polaris-ActionMenu-MenuGroup__Details" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/SecondaryAction/SecondaryAction.css.js
var styles$44 = {
	"SecondaryAction": "Polaris-ActionMenu-SecondaryAction",
	"critical": "Polaris-ActionMenu-SecondaryAction--critical"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/SecondaryAction/SecondaryAction.js
function SecondaryAction({ children, tone, helpText, onAction, destructive, ...rest }) {
	const buttonMarkup = /* @__PURE__ */ React.createElement(Button, Object.assign({
		onClick: onAction,
		tone: destructive ? "critical" : void 0
	}, rest), children);
	const actionMarkup = helpText ? /* @__PURE__ */ React.createElement(Tooltip, {
		preferredPosition: "below",
		content: helpText
	}, buttonMarkup) : buttonMarkup;
	return /* @__PURE__ */ React.createElement("div", { className: classNames(styles$44.SecondaryAction, tone === "critical" && styles$44.critical) }, actionMarkup);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/MenuGroup/MenuGroup.js
function MenuGroup({ accessibilityLabel, active, actions, details, title, icon, disabled, onClick, onClose, onOpen, sections }) {
	const handleClose = useCallback(() => {
		onClose(title);
	}, [onClose, title]);
	const handleOpen = useCallback(() => {
		onOpen(title);
	}, [onOpen, title]);
	const handleClick = useCallback(() => {
		if (onClick) onClick(handleOpen);
		else handleOpen();
	}, [onClick, handleOpen]);
	const popoverActivator = /* @__PURE__ */ React.createElement(SecondaryAction, {
		disclosure: true,
		disabled,
		icon,
		accessibilityLabel,
		onClick: handleClick
	}, title);
	return /* @__PURE__ */ React.createElement(Popover, {
		active: Boolean(active),
		activator: popoverActivator,
		preferredAlignment: "left",
		onClose: handleClose,
		hideOnPrint: true
	}, /* @__PURE__ */ React.createElement(ActionList, {
		items: actions,
		sections,
		onActionAnyItem: handleClose
	}), details && /* @__PURE__ */ React.createElement("div", { className: styles$45.Details }, details));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/Actions/components/ActionsMeasurer/ActionsMeasurer.js
var ACTION_SPACING$1 = 8;
function ActionsMeasurer({ actions = [], groups = [], handleMeasurement: handleMeasurementProp }) {
	const i18n = useI18n();
	const containerNode = useRef(null);
	const defaultRollupGroup = {
		title: i18n.translate("Polaris.ActionMenu.Actions.moreActions"),
		actions: []
	};
	const activator = /* @__PURE__ */ React.createElement(SecondaryAction, { disclosure: true }, defaultRollupGroup.title);
	const handleMeasurement = useCallback(() => {
		if (!containerNode.current) return;
		const containerWidth = containerNode.current.offsetWidth;
		const hiddenActionNodes = containerNode.current.children;
		const hiddenActionsWidths = Array.from(hiddenActionNodes).map((node) => {
			return Math.ceil(node.getBoundingClientRect().width) + ACTION_SPACING$1;
		});
		handleMeasurementProp({
			containerWidth,
			disclosureWidth: hiddenActionsWidths.pop() || 0,
			hiddenActionsWidths
		});
	}, [handleMeasurementProp]);
	useEffect(() => {
		handleMeasurement();
	}, [
		handleMeasurement,
		actions,
		groups
	]);
	const actionsMarkup = actions.map((action) => {
		const { content, onAction, ...rest } = action;
		return /* @__PURE__ */ React.createElement(SecondaryAction, Object.assign({
			key: content,
			onClick: onAction
		}, rest), content);
	});
	const groupsMarkup = groups.map((group) => {
		const { title, icon } = group;
		return /* @__PURE__ */ React.createElement(SecondaryAction, {
			key: title,
			disclosure: true,
			icon
		}, title);
	});
	useEventListener("resize", handleMeasurement);
	return /* @__PURE__ */ React.createElement("div", {
		className: styles$46.ActionsLayoutMeasurer,
		ref: containerNode
	}, actionsMarkup, groupsMarkup, activator);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/components/Actions/Actions.js
function Actions({ actions, groups, onActionRollup }) {
	const i18n = useI18n();
	const rollupActiveRef = useRef(null);
	const [activeMenuGroup, setActiveMenuGroup] = useState(void 0);
	const [state, setState] = useReducer((data, partialData) => {
		return {
			...data,
			...partialData
		};
	}, {
		disclosureWidth: 0,
		containerWidth: Infinity,
		actionsWidths: [],
		visibleActions: [],
		hiddenActions: [],
		visibleGroups: [],
		hiddenGroups: [],
		hasMeasured: false
	});
	const { visibleActions, hiddenActions, visibleGroups, hiddenGroups, containerWidth, disclosureWidth, actionsWidths, hasMeasured } = state;
	const defaultRollupGroup = {
		title: i18n.translate("Polaris.ActionMenu.Actions.moreActions"),
		actions: []
	};
	const handleMenuGroupToggle = useCallback((group) => setActiveMenuGroup(activeMenuGroup ? void 0 : group), [activeMenuGroup]);
	const handleMenuGroupClose = useCallback(() => setActiveMenuGroup(void 0), []);
	useEffect(() => {
		if (containerWidth === 0) return;
		const { visibleActions, visibleGroups, hiddenActions, hiddenGroups } = getVisibleAndHiddenActionsIndices$1(actions, groups, disclosureWidth, actionsWidths, containerWidth);
		setState({
			visibleActions,
			visibleGroups,
			hiddenActions,
			hiddenGroups,
			hasMeasured: containerWidth !== Infinity
		});
	}, [
		containerWidth,
		disclosureWidth,
		actions,
		groups,
		actionsWidths,
		setState
	]);
	const actionsOrDefault = useMemo(() => actions ?? [], [actions]);
	const groupsOrDefault = useMemo(() => groups ?? [], [groups]);
	const actionsMarkup = actionsOrDefault.filter((_, index) => {
		if (!visibleActions.includes(index)) return false;
		return true;
	}).map((action) => {
		const { content, onAction, ...rest } = action;
		return /* @__PURE__ */ React.createElement(SecondaryAction, Object.assign({
			key: content,
			onClick: onAction
		}, rest), content);
	});
	const filteredGroups = (hiddenGroups.length > 0 || hiddenActions.length > 0 ? [...groupsOrDefault, defaultRollupGroup] : [...groupsOrDefault]).filter((group, index) => {
		const hasNoGroupsProp = groupsOrDefault.length === 0;
		const isVisibleGroup = visibleGroups.includes(index);
		const isDefaultGroup = group === defaultRollupGroup;
		if (hasNoGroupsProp) return hiddenActions.length > 0;
		if (isDefaultGroup) return true;
		return isVisibleGroup;
	});
	const hiddenActionObjects = hiddenActions.map((index) => actionsOrDefault[index]).filter((action) => action != null);
	const hiddenGroupObjects = hiddenGroups.map((index) => groupsOrDefault[index]).filter((group) => group != null);
	const groupsMarkup = filteredGroups.map((group) => {
		const { title, actions: groupActions, ...rest } = group;
		const isDefaultGroup = group === defaultRollupGroup;
		const [finalRolledUpActions, finalRolledUpSectionGroups] = [...hiddenActionObjects, ...hiddenGroupObjects].reduce(([actions, sections], action) => {
			if (isMenuGroup(action)) sections.push({
				title: action.title,
				items: action.actions.map((sectionAction) => ({
					...sectionAction,
					disabled: action.disabled || sectionAction.disabled
				}))
			});
			else actions.push(action);
			return [actions, sections];
		}, [[], []]);
		if (!isDefaultGroup) return /* @__PURE__ */ React.createElement(MenuGroup, Object.assign({
			key: title,
			title,
			active: title === activeMenuGroup,
			actions: groupActions
		}, rest, {
			onOpen: handleMenuGroupToggle,
			onClose: handleMenuGroupClose
		}));
		return /* @__PURE__ */ React.createElement(MenuGroup, Object.assign({
			key: title,
			title,
			active: title === activeMenuGroup,
			actions: [...finalRolledUpActions, ...groupActions],
			sections: finalRolledUpSectionGroups
		}, rest, {
			onOpen: handleMenuGroupToggle,
			onClose: handleMenuGroupClose
		}));
	});
	const handleMeasurement = useCallback((measurements) => {
		const { hiddenActionsWidths: actionsWidths, containerWidth, disclosureWidth } = measurements;
		const { visibleActions, hiddenActions, visibleGroups, hiddenGroups } = getVisibleAndHiddenActionsIndices$1(actionsOrDefault, groupsOrDefault, disclosureWidth, actionsWidths, containerWidth);
		if (onActionRollup) {
			const isRollupActive = hiddenActions.length > 0 || hiddenGroups.length > 0;
			if (rollupActiveRef.current !== isRollupActive) {
				onActionRollup(isRollupActive);
				rollupActiveRef.current = isRollupActive;
			}
		}
		setState({
			visibleActions,
			hiddenActions,
			visibleGroups,
			hiddenGroups,
			actionsWidths,
			containerWidth,
			disclosureWidth,
			hasMeasured: true
		});
	}, [
		actionsOrDefault,
		groupsOrDefault,
		onActionRollup
	]);
	const actionsMeasurer = /* @__PURE__ */ React.createElement(ActionsMeasurer, {
		actions,
		groups,
		handleMeasurement
	});
	return /* @__PURE__ */ React.createElement("div", { className: styles$46.ActionsLayoutOuter }, actionsMeasurer, /* @__PURE__ */ React.createElement("div", { className: classNames(styles$46.ActionsLayout, !hasMeasured && styles$46["ActionsLayout--measuring"]) }, actionsMarkup, groupsMarkup));
}
function isMenuGroup(actionOrMenuGroup) {
	return "title" in actionOrMenuGroup;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ActionMenu/ActionMenu.js
function ActionMenu({ actions = [], groups = [], rollup, rollupActionsLabel, onActionRollup }) {
	if (actions.length === 0 && groups.length === 0) return null;
	const actionMenuClassNames = classNames(styles$49.ActionMenu, rollup && styles$49.rollup);
	const rollupSections = groups.map((group) => convertGroupToSection(group));
	return /* @__PURE__ */ React.createElement("div", { className: actionMenuClassNames }, rollup ? /* @__PURE__ */ React.createElement(RollupActions, {
		accessibilityLabel: rollupActionsLabel,
		items: actions,
		sections: rollupSections
	}) : /* @__PURE__ */ React.createElement(Actions, {
		actions,
		groups,
		onActionRollup
	}));
}
function hasGroupsWithActions(groups = []) {
	return groups.length === 0 ? false : groups.some((group) => group.actions.length > 0);
}
function convertGroupToSection({ title, actions, disabled }) {
	return {
		title,
		items: actions.map((action) => ({
			...action,
			disabled: disabled || action.disabled
		}))
	};
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/listbox/context.js
var WithinListboxContext = /* @__PURE__ */ createContext(false);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Checkbox/Checkbox.css.js
var styles$43 = {
	"Checkbox": "Polaris-Checkbox",
	"ChoiceLabel": "Polaris-Checkbox__ChoiceLabel",
	"Backdrop": "Polaris-Checkbox__Backdrop",
	"Input": "Polaris-Checkbox__Input",
	"Input-indeterminate": "Polaris-Checkbox__Input--indeterminate",
	"Icon": "Polaris-Checkbox__Icon",
	"animated": "Polaris-Checkbox--animated",
	"toneMagic": "Polaris-Checkbox--toneMagic",
	"hover": "Polaris-Checkbox--hover",
	"error": "Polaris-Checkbox--error",
	"checked": "Polaris-Checkbox--checked",
	"pathAnimation": "Polaris-Checkbox--pathAnimation"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Choice/Choice.css.js
var styles$42 = {
	"Choice": "Polaris-Choice",
	"labelHidden": "Polaris-Choice--labelHidden",
	"Label": "Polaris-Choice__Label",
	"Control": "Polaris-Choice__Control",
	"disabled": "Polaris-Choice--disabled",
	"toneMagic": "Polaris-Choice--toneMagic",
	"Descriptions": "Polaris-Choice__Descriptions",
	"HelpText": "Polaris-Choice__HelpText"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Choice/Choice.js
function Choice({ id, label, disabled, error, children, labelHidden, helpText, onClick, labelClassName, fill, bleed, bleedBlockStart, bleedBlockEnd, bleedInlineStart, bleedInlineEnd, tone }) {
	const className = classNames(styles$42.Choice, labelHidden && styles$42.labelHidden, disabled && styles$42.disabled, tone && styles$42[variationName("tone", tone)], labelClassName);
	const labelStyle = {
		...getResponsiveProps("choice", "bleed-block-end", "space", bleedBlockEnd || bleed),
		...getResponsiveProps("choice", "bleed-block-start", "space", bleedBlockStart || bleed),
		...getResponsiveProps("choice", "bleed-inline-start", "space", bleedInlineStart || bleed),
		...getResponsiveProps("choice", "bleed-inline-end", "space", bleedInlineEnd || bleed),
		...Object.fromEntries(Object.entries(getResponsiveValue("choice", "fill", fill)).map(([key, value]) => [key, value ? "100%" : "auto"]))
	};
	const labelMarkup = /* @__PURE__ */ React.createElement("label", {
		className,
		htmlFor: id,
		onClick,
		style: sanitizeCustomProperties(labelStyle)
	}, /* @__PURE__ */ React.createElement("span", { className: styles$42.Control }, children), /* @__PURE__ */ React.createElement("span", { className: styles$42.Label }, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd"
	}, label)));
	const helpTextMarkup = helpText ? /* @__PURE__ */ React.createElement("div", {
		className: styles$42.HelpText,
		id: helpTextID(id)
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		tone: disabled ? void 0 : "subdued"
	}, helpText)) : null;
	const errorMarkup = error && typeof error !== "boolean" && /* @__PURE__ */ React.createElement("div", { className: styles$42.Error }, /* @__PURE__ */ React.createElement(InlineError, {
		message: error,
		fieldID: id
	}));
	const descriptionMarkup = helpTextMarkup || errorMarkup ? /* @__PURE__ */ React.createElement("div", { className: styles$42.Descriptions }, errorMarkup, helpTextMarkup) : null;
	return descriptionMarkup ? /* @__PURE__ */ React.createElement("div", null, labelMarkup, descriptionMarkup) : labelMarkup;
}
function helpTextID(id) {
	return `${id}HelpText`;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Checkbox/Checkbox.js
var Checkbox$1 = /* @__PURE__ */ forwardRef(function Checkbox({ ariaControls, ariaDescribedBy: ariaDescribedByProp, label, labelHidden, checked = false, helpText, disabled, id: idProp, name, value, error, onChange, onFocus, onBlur, labelClassName, fill, bleed, bleedBlockStart, bleedBlockEnd, bleedInlineStart, bleedInlineEnd, tone }, ref) {
	const inputNode = useRef(null);
	const uniqId = useId();
	const id = idProp ?? uniqId;
	const isWithinListbox = useContext(WithinListboxContext);
	useImperativeHandle(ref, () => ({ focus: () => {
		if (inputNode.current) inputNode.current.focus();
	} }));
	const handleBlur = () => {
		onBlur && onBlur();
	};
	const handleOnClick = () => {
		if (onChange == null || inputNode.current == null || disabled) return;
		onChange(inputNode.current.checked, id);
		inputNode.current.focus();
	};
	const describedBy = [];
	if (error && typeof error !== "boolean") describedBy.push(errorTextID(id));
	if (helpText) describedBy.push(helpTextID(id));
	if (ariaDescribedByProp) describedBy.push(ariaDescribedByProp);
	const ariaDescribedBy = describedBy.length ? describedBy.join(" ") : void 0;
	const wrapperClassName = classNames(styles$43.Checkbox, error && styles$43.error);
	const isIndeterminate = checked === "indeterminate";
	const isChecked = !isIndeterminate && Boolean(checked);
	const indeterminateAttributes = isIndeterminate ? {
		indeterminate: "true",
		"aria-checked": "mixed"
	} : { "aria-checked": isChecked };
	const iconSource = /* @__PURE__ */ React.createElement("svg", {
		viewBox: "0 0 16 16",
		shapeRendering: "geometricPrecision",
		textRendering: "geometricPrecision"
	}, /* @__PURE__ */ React.createElement("path", {
		className: classNames(checked && styles$43.checked),
		d: "M1.5,5.5L3.44655,8.22517C3.72862,8.62007,4.30578,8.64717,4.62362,8.28044L10.5,1.5",
		transform: "translate(2 2.980376)",
		opacity: "0",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		pathLength: "1"
	}));
	const inputClassName = classNames(styles$43.Input, isIndeterminate && styles$43["Input-indeterminate"], tone && styles$43[variationName("tone", tone)]);
	const extraChoiceProps = {
		helpText,
		error,
		bleed,
		bleedBlockStart,
		bleedBlockEnd,
		bleedInlineStart,
		bleedInlineEnd
	};
	return /* @__PURE__ */ React.createElement(Choice, Object.assign({
		id,
		label,
		labelHidden,
		disabled,
		labelClassName: classNames(styles$43.ChoiceLabel, labelClassName),
		fill,
		tone
	}, extraChoiceProps), /* @__PURE__ */ React.createElement("span", { className: wrapperClassName }, /* @__PURE__ */ React.createElement("input", Object.assign({
		ref: inputNode,
		id,
		name,
		value,
		type: "checkbox",
		checked: isChecked,
		disabled,
		className: inputClassName,
		onBlur: handleBlur,
		onChange: noop$6,
		onClick: handleOnClick,
		onFocus,
		"aria-invalid": error != null,
		"aria-controls": ariaControls,
		"aria-describedby": ariaDescribedBy,
		role: isWithinListbox ? "presentation" : "checkbox"
	}, indeterminateAttributes)), /* @__PURE__ */ React.createElement("span", {
		className: styles$43.Backdrop,
		onClick: stopPropagation,
		onKeyUp: stopPropagation
	}), /* @__PURE__ */ React.createElement("span", { className: classNames(styles$43.Icon, !isIndeterminate && styles$43.animated) }, isIndeterminate ? /* @__PURE__ */ React.createElement(Icon, { source: SvgMinusIcon }) : iconSource)));
});
function noop$6() {}
function stopPropagation(event) {
	event.stopPropagation();
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Backdrop/Backdrop.css.js
var styles$41 = {
	"Backdrop": "Polaris-Backdrop",
	"transparent": "Polaris-Backdrop--transparent",
	"belowNavigation": "Polaris-Backdrop--belowNavigation"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/scroll-lock-manager/hooks.js
function useScrollLockManager() {
	const scrollLockManager = useContext(ScrollLockManagerContext);
	if (!scrollLockManager) throw new MissingAppProviderError("No ScrollLockManager was provided.");
	return scrollLockManager;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ScrollLock/ScrollLock.js
function ScrollLock(_) {
	const scrollLockManager = useScrollLockManager();
	useEffect(() => {
		scrollLockManager.registerScrollLock();
		return () => {
			scrollLockManager.unregisterScrollLock();
		};
	}, [scrollLockManager]);
	return null;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Backdrop/Backdrop.js
function Backdrop(props) {
	const { onClick, onTouchStart, belowNavigation, transparent, setClosing } = props;
	const className = classNames(styles$41.Backdrop, belowNavigation && styles$41.belowNavigation, transparent && styles$41.transparent);
	const handleMouseDown = () => {
		if (setClosing) setClosing(true);
	};
	const handleClick = () => {
		if (setClosing) setClosing(false);
		if (onClick) onClick();
	};
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ScrollLock, null), /* @__PURE__ */ React.createElement("div", {
		className,
		onClick: handleClick,
		onTouchStart,
		onMouseDown: handleMouseDown
	}));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/banner-context.js
var BannerContext = /* @__PURE__ */ createContext(false);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Banner/Banner.css.js
var styles$40 = {
	"Banner": "Polaris-Banner",
	"keyFocused": "Polaris-Banner--keyFocused",
	"withinContentContainer": "Polaris-Banner--withinContentContainer",
	"withinPage": "Polaris-Banner--withinPage",
	"DismissIcon": "Polaris-Banner__DismissIcon",
	"text-success-on-bg-fill": "Polaris-Banner--textSuccessOnBgFill",
	"text-success": "Polaris-Banner__text--success",
	"text-warning-on-bg-fill": "Polaris-Banner--textWarningOnBgFill",
	"text-warning": "Polaris-Banner__text--warning",
	"text-critical-on-bg-fill": "Polaris-Banner--textCriticalOnBgFill",
	"text-critical": "Polaris-Banner__text--critical",
	"text-info-on-bg-fill": "Polaris-Banner--textInfoOnBgFill",
	"text-info": "Polaris-Banner__text--info",
	"icon-secondary": "Polaris-Banner__icon--secondary"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Banner/utilities.js
var bannerAttributes = {
	success: {
		withinPage: {
			background: "bg-fill-success",
			text: "text-success-on-bg-fill",
			icon: "text-success-on-bg-fill"
		},
		withinContentContainer: {
			background: "bg-surface-success",
			text: "text-success",
			icon: "text-success"
		},
		icon: SvgCheckIcon
	},
	warning: {
		withinPage: {
			background: "bg-fill-warning",
			text: "text-warning-on-bg-fill",
			icon: "text-warning-on-bg-fill"
		},
		withinContentContainer: {
			background: "bg-surface-warning",
			text: "text-warning",
			icon: "text-warning"
		},
		icon: SvgAlertTriangleIcon
	},
	critical: {
		withinPage: {
			background: "bg-fill-critical",
			text: "text-critical-on-bg-fill",
			icon: "text-critical-on-bg-fill"
		},
		withinContentContainer: {
			background: "bg-surface-critical",
			text: "text-critical",
			icon: "text-critical"
		},
		icon: SvgAlertDiamondIcon
	},
	info: {
		withinPage: {
			background: "bg-fill-info",
			text: "text-info-on-bg-fill",
			icon: "text-info-on-bg-fill"
		},
		withinContentContainer: {
			background: "bg-surface-info",
			text: "text-info",
			icon: "text-info"
		},
		icon: SvgInfoIcon
	}
};
function useBannerFocus(bannerRef) {
	const wrapperRef = useRef(null);
	const [shouldShowFocus, setShouldShowFocus] = useState(false);
	useImperativeHandle(bannerRef, () => ({ focus: () => {
		wrapperRef.current?.focus();
		setShouldShowFocus(true);
	} }), []);
	const handleKeyUp = (event) => {
		if (event.target === wrapperRef.current) setShouldShowFocus(true);
	};
	const handleBlur = () => setShouldShowFocus(false);
	const handleMouseUp = (event) => {
		event.currentTarget.blur();
		setShouldShowFocus(false);
	};
	return {
		wrapperRef,
		handleKeyUp,
		handleBlur,
		handleMouseUp,
		shouldShowFocus
	};
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ButtonGroup/ButtonGroup.css.js
var styles$39 = {
	"ButtonGroup": "Polaris-ButtonGroup",
	"Item": "Polaris-ButtonGroup__Item",
	"Item-plain": "Polaris-ButtonGroup__Item--plain",
	"variantSegmented": "Polaris-ButtonGroup--variantSegmented",
	"Item-focused": "Polaris-ButtonGroup__Item--focused",
	"fullWidth": "Polaris-ButtonGroup--fullWidth",
	"extraTight": "Polaris-ButtonGroup--extraTight",
	"tight": "Polaris-ButtonGroup--tight",
	"loose": "Polaris-ButtonGroup--loose",
	"noWrap": "Polaris-ButtonGroup--noWrap"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ButtonGroup/components/Item/Item.js
function Item$4({ button }) {
	const { value: focused, setTrue: forceTrueFocused, setFalse: forceFalseFocused } = useToggle(false);
	const className = classNames(styles$39.Item, focused && styles$39["Item-focused"], button.props.variant === "plain" && styles$39["Item-plain"]);
	return /* @__PURE__ */ React.createElement("div", {
		className,
		onFocus: forceTrueFocused,
		onBlur: forceFalseFocused
	}, button);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ButtonGroup/ButtonGroup.js
function ButtonGroup({ children, gap, variant, fullWidth, connectedTop, noWrap }) {
	const className = classNames(styles$39.ButtonGroup, gap && styles$39[gap], variant && styles$39[variationName("variant", variant)], fullWidth && styles$39.fullWidth, noWrap && styles$39.noWrap);
	const contents = elementChildren(children).map((child, index) => /* @__PURE__ */ React.createElement(Item$4, {
		button: child,
		key: index
	}));
	return /* @__PURE__ */ React.createElement("div", {
		className,
		"data-buttongroup-variant": variant,
		"data-buttongroup-connected-top": connectedTop,
		"data-buttongroup-full-width": fullWidth,
		"data-buttongroup-no-wrap": noWrap
	}, contents);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Banner/Banner.js
var Banner = /* @__PURE__ */ forwardRef(function Banner(props, bannerRef) {
	const { tone, stopAnnouncements } = props;
	const withinContentContainer = useContext(WithinContentContext);
	const { wrapperRef, handleKeyUp, handleBlur, handleMouseUp, shouldShowFocus } = useBannerFocus(bannerRef);
	const className = classNames(styles$40.Banner, shouldShowFocus && styles$40.keyFocused, withinContentContainer ? styles$40.withinContentContainer : styles$40.withinPage);
	return /* @__PURE__ */ React.createElement(BannerContext.Provider, { value: true }, /* @__PURE__ */ React.createElement("div", {
		className,
		tabIndex: 0,
		ref: wrapperRef,
		role: tone === "warning" || tone === "critical" ? "alert" : "status",
		"aria-live": stopAnnouncements ? "off" : "polite",
		onMouseUp: handleMouseUp,
		onKeyUp: handleKeyUp,
		onBlur: handleBlur
	}, /* @__PURE__ */ React.createElement(BannerLayout, props)));
});
function BannerLayout({ tone = "info", icon, hideIcon, onDismiss, action, secondaryAction, title, children }) {
	const i18n = useI18n();
	const withinContentContainer = useContext(WithinContentContext);
	const isInlineIconBanner = !title && !withinContentContainer;
	const bannerTone = Object.keys(bannerAttributes).includes(tone) ? tone : "info";
	const bannerColors = bannerAttributes[bannerTone][withinContentContainer ? "withinContentContainer" : "withinPage"];
	const sharedBannerProps = {
		backgroundColor: bannerColors.background,
		textColor: bannerColors.text,
		bannerTitle: title ? /* @__PURE__ */ React.createElement(Text, {
			as: "h2",
			variant: "headingSm",
			breakWord: true
		}, title) : null,
		bannerIcon: hideIcon ? null : /* @__PURE__ */ React.createElement("span", { className: styles$40[bannerColors.icon] }, /* @__PURE__ */ React.createElement(Icon, { source: icon ?? bannerAttributes[bannerTone].icon })),
		actionButtons: action || secondaryAction ? /* @__PURE__ */ React.createElement(ButtonGroup, null, action && /* @__PURE__ */ React.createElement(Button, Object.assign({ onClick: action.onAction }, action), action.content), secondaryAction && /* @__PURE__ */ React.createElement(Button, Object.assign({ onClick: secondaryAction.onAction }, secondaryAction), secondaryAction.content)) : null,
		dismissButton: onDismiss ? /* @__PURE__ */ React.createElement(Button, {
			variant: "tertiary",
			icon: /* @__PURE__ */ React.createElement("span", { className: styles$40[isInlineIconBanner ? "icon-secondary" : bannerColors.icon] }, /* @__PURE__ */ React.createElement(Icon, { source: SvgXIcon })),
			onClick: onDismiss,
			accessibilityLabel: i18n.translate("Polaris.Banner.dismissButton")
		}) : null
	};
	const childrenMarkup = children ? /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd"
	}, children) : null;
	if (withinContentContainer) return /* @__PURE__ */ React.createElement(WithinContentContainerBanner, sharedBannerProps, childrenMarkup);
	if (isInlineIconBanner) return /* @__PURE__ */ React.createElement(InlineIconBanner, sharedBannerProps, childrenMarkup);
	return /* @__PURE__ */ React.createElement(DefaultBanner, sharedBannerProps, childrenMarkup);
}
function DefaultBanner({ backgroundColor, textColor, bannerTitle, bannerIcon, actionButtons, dismissButton, children }) {
	const { smUp } = useBreakpoints();
	const hasContent = children || actionButtons;
	return /* @__PURE__ */ React.createElement(Box, { width: "100%" }, /* @__PURE__ */ React.createElement(BlockStack, { align: "space-between" }, /* @__PURE__ */ React.createElement(Box, {
		background: backgroundColor,
		color: textColor,
		borderStartStartRadius: smUp ? "300" : void 0,
		borderStartEndRadius: smUp ? "300" : void 0,
		borderEndStartRadius: !hasContent && smUp ? "300" : void 0,
		borderEndEndRadius: !hasContent && smUp ? "300" : void 0,
		padding: "300"
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		align: "space-between",
		blockAlign: "center",
		gap: "200",
		wrap: false
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "100",
		wrap: false
	}, bannerIcon, bannerTitle), dismissButton)), hasContent && /* @__PURE__ */ React.createElement(Box, {
		padding: {
			xs: "300",
			md: "400"
		},
		paddingBlockStart: "300"
	}, /* @__PURE__ */ React.createElement(BlockStack, { gap: "200" }, /* @__PURE__ */ React.createElement("div", null, children), actionButtons))));
}
function InlineIconBanner({ backgroundColor, bannerIcon, actionButtons, dismissButton, children }) {
	const [blockAlign, setBlockAlign] = useState("center");
	const contentNode = useRef(null);
	const iconNode = useRef(null);
	const dismissIconNode = useRef(null);
	const handleResize = useCallback(() => {
		const contentHeight = contentNode.current?.offsetHeight;
		const iconBoxHeight = iconNode.current?.offsetHeight || dismissIconNode.current?.offsetHeight;
		if (!contentHeight || !iconBoxHeight) return;
		contentHeight > iconBoxHeight ? setBlockAlign("start") : setBlockAlign("center");
	}, []);
	useEffect(() => handleResize(), [handleResize]);
	useEventListener("resize", handleResize);
	return /* @__PURE__ */ React.createElement(Box, {
		width: "100%",
		padding: "300",
		borderRadius: "300"
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		align: "space-between",
		blockAlign,
		wrap: false
	}, /* @__PURE__ */ React.createElement(Box, { width: "100%" }, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "200",
		wrap: false,
		blockAlign
	}, bannerIcon ? /* @__PURE__ */ React.createElement("div", { ref: iconNode }, /* @__PURE__ */ React.createElement(Box, {
		background: backgroundColor,
		borderRadius: "200",
		padding: "100"
	}, bannerIcon)) : null, /* @__PURE__ */ React.createElement(Box, {
		ref: contentNode,
		width: "100%"
	}, /* @__PURE__ */ React.createElement(BlockStack, { gap: "200" }, /* @__PURE__ */ React.createElement("div", null, children), actionButtons)))), /* @__PURE__ */ React.createElement("div", {
		ref: dismissIconNode,
		className: styles$40.DismissIcon
	}, dismissButton)));
}
function WithinContentContainerBanner({ backgroundColor, textColor, bannerTitle, bannerIcon, actionButtons, dismissButton, children }) {
	return /* @__PURE__ */ React.createElement(Box, {
		width: "100%",
		background: backgroundColor,
		padding: "200",
		borderRadius: "200",
		color: textColor
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		align: "space-between",
		blockAlign: "start",
		wrap: false,
		gap: "200"
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "150",
		wrap: false
	}, bannerIcon, /* @__PURE__ */ React.createElement(Box, { width: "100%" }, /* @__PURE__ */ React.createElement(BlockStack, { gap: "200" }, /* @__PURE__ */ React.createElement(BlockStack, { gap: "050" }, bannerTitle, /* @__PURE__ */ React.createElement("div", null, children)), actionButtons))), dismissButton));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Bleed/Bleed.css.js
var styles$38 = { "Bleed": "Polaris-Bleed" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Bleed/Bleed.js
var Bleed = ({ marginInline, marginBlock, marginBlockStart, marginBlockEnd, marginInlineStart, marginInlineEnd, children }) => {
	const getNegativeMargins = (direction) => {
		const xAxis = ["marginInlineStart", "marginInlineEnd"];
		const yAxis = ["marginBlockStart", "marginBlockEnd"];
		const directionValues = {
			marginBlockStart,
			marginBlockEnd,
			marginInlineStart,
			marginInlineEnd,
			marginInline,
			marginBlock
		};
		if (directionValues[direction]) return directionValues[direction];
		else if (xAxis.includes(direction) && marginInline) return directionValues.marginInline;
		else if (yAxis.includes(direction) && marginBlock) return directionValues.marginBlock;
	};
	const negativeMarginBlockStart = getNegativeMargins("marginBlockStart");
	const negativeMarginBlockEnd = getNegativeMargins("marginBlockEnd");
	const negativeMarginInlineStart = getNegativeMargins("marginInlineStart");
	const negativeMarginInlineEnd = getNegativeMargins("marginInlineEnd");
	const style = {
		...getResponsiveProps("bleed", "margin-block-start", "space", negativeMarginBlockStart),
		...getResponsiveProps("bleed", "margin-block-end", "space", negativeMarginBlockEnd),
		...getResponsiveProps("bleed", "margin-inline-start", "space", negativeMarginInlineStart),
		...getResponsiveProps("bleed", "margin-inline-end", "space", negativeMarginInlineEnd)
	};
	return /* @__PURE__ */ React.createElement("div", {
		className: styles$38.Bleed,
		style: sanitizeCustomProperties(style)
	}, children);
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Breadcrumbs/Breadcrumbs.js
function Breadcrumbs({ backAction }) {
	const { content } = backAction;
	return /* @__PURE__ */ React.createElement(Button, {
		key: content,
		url: "url" in backAction ? backAction.url : void 0,
		onClick: "onAction" in backAction ? backAction.onAction : void 0,
		onPointerDown: handleMouseUpByBlurring,
		icon: SvgArrowLeftIcon,
		accessibilityLabel: backAction.accessibilityLabel ?? content
	});
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/BulkActions/utilities.js
function getVisibleAndHiddenActionsIndices(promotedActions = [], disclosureWidth, actionsWidths, containerWidth) {
	const sumTabWidths = actionsWidths.reduce((sum, width) => sum + width, 0);
	const arrayOfPromotedActionsIndices = promotedActions.map((_, index) => {
		return index;
	});
	const visiblePromotedActions = [];
	const hiddenPromotedActions = [];
	if (containerWidth > sumTabWidths) visiblePromotedActions.push(...arrayOfPromotedActionsIndices);
	else {
		let accumulatedWidth = 0;
		let hasReturned = false;
		arrayOfPromotedActionsIndices.forEach((currentPromotedActionsIndex) => {
			const currentActionsWidth = actionsWidths[currentPromotedActionsIndex];
			if (accumulatedWidth + currentActionsWidth >= containerWidth - disclosureWidth || hasReturned) {
				hiddenPromotedActions.push(currentPromotedActionsIndex);
				hasReturned = true;
				return;
			}
			visiblePromotedActions.push(currentPromotedActionsIndex);
			accumulatedWidth += currentActionsWidth;
		});
	}
	return {
		visiblePromotedActions,
		hiddenPromotedActions
	};
}
function instanceOfBulkActionListSectionArray(actions) {
	const validList = actions.filter((action) => {
		return action.items;
	});
	return actions.length === validList.length;
}
function instanceOfBulkActionArray(actions) {
	const validList = actions.filter((action) => {
		return !action.items;
	});
	return actions.length === validList.length;
}
function instanceOfMenuGroupDescriptor(action) {
	return "title" in action && "actions" in action;
}
function instanceOfBulkActionListSection(action) {
	return "items" in action;
}
function getActionSections(actions) {
	if (!actions || actions.length === 0) return;
	if (instanceOfBulkActionListSectionArray(actions)) return actions;
	if (instanceOfBulkActionArray(actions)) return [{ items: actions }];
}
function isNewBadgeInBadgeActions(actionSections) {
	if (!actionSections) return false;
	for (const action of actionSections) for (const item of action.items) if (item.badge?.tone === "new") return true;
	return false;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/BulkActions/BulkActions.css.js
var styles$37 = {
	"BulkActionsOuterLayout": "Polaris-BulkActions__BulkActionsOuterLayout",
	"BulkActionsSelectAllWrapper": "Polaris-BulkActions__BulkActionsSelectAllWrapper",
	"BulkActionsPromotedActionsWrapper": "Polaris-BulkActions__BulkActionsPromotedActionsWrapper",
	"BulkActionsLayout": "Polaris-BulkActions__BulkActionsLayout",
	"BulkActionsLayout--measuring": "Polaris-BulkActions--bulkActionsLayoutMeasuring",
	"BulkActionsMeasurerLayout": "Polaris-BulkActions__BulkActionsMeasurerLayout",
	"BulkActionButton": "Polaris-BulkActions__BulkActionButton",
	"disabled": "Polaris-BulkActions--disabled",
	"AllAction": "Polaris-BulkActions__AllAction"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Indicator/Indicator.css.js
var styles$36 = {
	"Indicator": "Polaris-Indicator",
	"pulseIndicator": "Polaris-Indicator--pulseIndicator"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Indicator/Indicator.js
function Indicator({ pulse = true }) {
	const className = classNames(styles$36.Indicator, pulse && styles$36.pulseIndicator);
	return /* @__PURE__ */ React.createElement("span", { className });
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/BulkActions/components/BulkActionButton/BulkActionButton.js
function BulkActionButton({ handleMeasurement, url, external, onAction, content, disclosure, accessibilityLabel, disabled, destructive, indicator, showContentInButton, size }) {
	const bulkActionButton = useRef(null);
	useComponentDidMount(() => {
		if (handleMeasurement && bulkActionButton.current) {
			const width = bulkActionButton.current.getBoundingClientRect().width;
			handleMeasurement(width);
		}
	});
	const isActivatorForMoreActionsPopover = disclosure && !showContentInButton;
	const buttonContent = isActivatorForMoreActionsPopover ? void 0 : content;
	const buttonMarkup = /* @__PURE__ */ React.createElement(Button, {
		external,
		url,
		accessibilityLabel: isActivatorForMoreActionsPopover ? content : accessibilityLabel,
		tone: destructive ? "critical" : void 0,
		disclosure: disclosure && showContentInButton,
		onClick: onAction,
		disabled,
		size,
		icon: isActivatorForMoreActionsPopover ? /* @__PURE__ */ React.createElement(Icon, {
			source: SvgMenuHorizontalIcon,
			tone: "base"
		}) : void 0
	}, buttonContent);
	return /* @__PURE__ */ React.createElement("div", {
		className: styles$37.BulkActionButton,
		ref: bulkActionButton
	}, isActivatorForMoreActionsPopover ? /* @__PURE__ */ React.createElement(Tooltip, {
		content,
		preferredPosition: "below"
	}, buttonMarkup) : buttonMarkup, indicator && /* @__PURE__ */ React.createElement(Indicator, null));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/BulkActions/components/BulkActionMenu/BulkActionMenu.js
function BulkActionMenu({ title, actions, isNewBadgeInBadgeActions, size }) {
	const { value: isVisible, toggle: toggleMenuVisibility } = useToggle(false);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Popover, {
		active: isVisible,
		activator: /* @__PURE__ */ React.createElement(BulkActionButton, {
			disclosure: true,
			showContentInButton: true,
			onAction: toggleMenuVisibility,
			content: title,
			indicator: isNewBadgeInBadgeActions,
			size
		}),
		onClose: toggleMenuVisibility,
		preferInputActivator: true
	}, /* @__PURE__ */ React.createElement(ActionList, {
		items: actions,
		onActionAnyItem: toggleMenuVisibility
	})));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/CheckableButton/CheckableButton.css.js
var styles$35 = {
	"CheckableButton": "Polaris-CheckableButton",
	"Checkbox": "Polaris-CheckableButton__Checkbox",
	"Label": "Polaris-CheckableButton__Label"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/CheckableButton/CheckableButton.js
var CheckableButton = /* @__PURE__ */ forwardRef(function CheckableButton({ accessibilityLabel, label = "", onToggleAll, selected, disabled, ariaLive }, ref) {
	const checkBoxRef = useRef(null);
	function focus() {
		checkBoxRef?.current?.focus();
	}
	useImperativeHandle(ref, () => {
		return { focus };
	});
	return /* @__PURE__ */ React.createElement("div", {
		className: styles$35.CheckableButton,
		onClick: onToggleAll
	}, /* @__PURE__ */ React.createElement("div", { className: styles$35.Checkbox }, /* @__PURE__ */ React.createElement(Checkbox$1, {
		label: accessibilityLabel,
		labelHidden: true,
		checked: selected,
		disabled,
		onChange: onToggleAll,
		ref: checkBoxRef
	})), label ? /* @__PURE__ */ React.createElement("span", {
		className: styles$35.Label,
		"aria-live": ariaLive
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodySm",
		fontWeight: "medium"
	}, label)) : null);
});
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/BulkActions/components/BulkActionsMeasurer/BulkActionsMeasurer.js
var ACTION_SPACING = 4;
function BulkActionsMeasurer({ promotedActions = [], disabled, buttonSize, handleMeasurement: handleMeasurementProp }) {
	const i18n = useI18n();
	const containerNode = useRef(null);
	const activatorLabel = i18n.translate("Polaris.ResourceList.BulkActions.moreActionsActivatorLabel");
	const activator = /* @__PURE__ */ React.createElement(BulkActionButton, {
		disclosure: true,
		content: activatorLabel
	});
	const handleMeasurement = useCallback(() => {
		if (!containerNode.current) return;
		const containerWidth = containerNode.current.offsetWidth;
		const hiddenActionNodes = containerNode.current.children;
		const hiddenActionsWidths = Array.from(hiddenActionNodes).map((node) => {
			return Math.ceil(node.getBoundingClientRect().width) + ACTION_SPACING;
		});
		handleMeasurementProp({
			containerWidth,
			disclosureWidth: hiddenActionsWidths.pop() || 0,
			hiddenActionsWidths
		});
	}, [handleMeasurementProp]);
	useEffect(() => {
		handleMeasurement();
	}, [handleMeasurement, promotedActions]);
	const promotedActionsMarkup = promotedActions.map((action, index) => {
		if (instanceOfMenuGroupDescriptor(action)) return /* @__PURE__ */ React.createElement(BulkActionButton, {
			key: index,
			disclosure: true,
			showContentInButton: true,
			content: action.title,
			size: buttonSize
		});
		return /* @__PURE__ */ React.createElement(BulkActionButton, Object.assign({
			key: index,
			disabled
		}, action, { size: buttonSize }));
	});
	useEventListener("resize", handleMeasurement);
	return /* @__PURE__ */ React.createElement("div", {
		className: styles$37.BulkActionsMeasurerLayout,
		ref: containerNode
	}, promotedActionsMarkup, activator);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/BulkActions/BulkActions.js
var BulkActions = /* @__PURE__ */ forwardRef(function BulkActions({ promotedActions, actions, disabled, buttonSize, paginatedSelectAllAction, paginatedSelectAllText, label, accessibilityLabel, selected, onToggleAll, onMoreActionPopoverToggle, width, selectMode }, ref) {
	const i18n = useI18n();
	const [popoverActive, setPopoverActive] = useState(false);
	const [state, setState] = useReducer((data, partialData) => {
		return {
			...data,
			...partialData
		};
	}, {
		disclosureWidth: 0,
		containerWidth: Infinity,
		actionsWidths: [],
		visiblePromotedActions: [],
		hiddenPromotedActions: [],
		hasMeasured: false
	});
	const { visiblePromotedActions, hiddenPromotedActions, containerWidth, disclosureWidth, actionsWidths, hasMeasured } = state;
	useEffect(() => {
		if (containerWidth === 0 || !promotedActions || promotedActions.length === 0) return;
		const { visiblePromotedActions, hiddenPromotedActions } = getVisibleAndHiddenActionsIndices(promotedActions, disclosureWidth, actionsWidths, containerWidth);
		setState({
			visiblePromotedActions,
			hiddenPromotedActions,
			hasMeasured: containerWidth !== Infinity
		});
	}, [
		containerWidth,
		disclosureWidth,
		promotedActions,
		actionsWidths
	]);
	const activatorLabel = !promotedActions || promotedActions && visiblePromotedActions.length === 0 ? i18n.translate("Polaris.ResourceList.BulkActions.actionsActivatorLabel") : i18n.translate("Polaris.ResourceList.BulkActions.moreActionsActivatorLabel");
	const paginatedSelectAllMarkup = paginatedSelectAllAction ? /* @__PURE__ */ React.createElement(UnstyledButton, {
		className: styles$37.AllAction,
		onClick: paginatedSelectAllAction.onAction,
		size: "slim",
		disabled
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodySm",
		fontWeight: "medium"
	}, paginatedSelectAllAction.content)) : null;
	const hasTextAndAction = paginatedSelectAllText && paginatedSelectAllAction;
	const checkableButtonProps = {
		accessibilityLabel,
		label: hasTextAndAction ? paginatedSelectAllText : label,
		selected,
		onToggleAll,
		disabled,
		ariaLive: hasTextAndAction ? "polite" : void 0,
		ref
	};
	const togglePopover = useCallback(() => {
		onMoreActionPopoverToggle?.(popoverActive);
		setPopoverActive((popoverActive) => !popoverActive);
	}, [onMoreActionPopoverToggle, popoverActive]);
	const handleMeasurement = useCallback((measurements) => {
		const { hiddenActionsWidths: actionsWidths, containerWidth, disclosureWidth } = measurements;
		if (!promotedActions || promotedActions.length === 0) return;
		const { visiblePromotedActions, hiddenPromotedActions } = getVisibleAndHiddenActionsIndices(promotedActions, disclosureWidth, actionsWidths, containerWidth);
		setState({
			visiblePromotedActions,
			hiddenPromotedActions,
			actionsWidths,
			containerWidth,
			disclosureWidth,
			hasMeasured: true
		});
	}, [promotedActions]);
	const actionSections = getActionSections(actions);
	const promotedActionsMarkup = promotedActions ? promotedActions.filter((_, index) => {
		if (!visiblePromotedActions.includes(index)) return false;
		return true;
	}).map((action, index) => {
		if (instanceOfMenuGroupDescriptor(action)) return /* @__PURE__ */ React.createElement(BulkActionMenu, Object.assign({ key: index }, action, {
			isNewBadgeInBadgeActions: isNewBadgeInBadgeActions(actionSections),
			size: buttonSize
		}));
		return /* @__PURE__ */ React.createElement(BulkActionButton, Object.assign({
			key: index,
			disabled
		}, action, { size: buttonSize }));
	}) : null;
	const hiddenPromotedSection = { items: hiddenPromotedActions.map((index) => promotedActions?.[index]).reduce((memo, action) => {
		if (!action) return memo;
		if (instanceOfMenuGroupDescriptor(action)) return memo.concat(action.actions);
		return memo.concat(action);
	}, []) };
	const allHiddenActions = useMemo(() => {
		if (actionSections) return actionSections;
		if (!actions) return [];
		let isAFlatArray = true;
		return actions.filter((action) => action).reduce((memo, action) => {
			if (instanceOfBulkActionListSection(action)) {
				isAFlatArray = false;
				return memo.concat(action);
			}
			if (isAFlatArray) {
				if (memo.length === 0) return [{ items: [action] }];
				const lastItem = memo[memo.length - 1];
				memo.splice(memo.length - 1, 1, { items: [...lastItem.items, action] });
				return memo;
			}
			isAFlatArray = true;
			return memo.concat({ items: [action] });
		}, []);
	}, [actions, actionSections]);
	const activator = /* @__PURE__ */ React.createElement(BulkActionButton, {
		disclosure: true,
		showContentInButton: !promotedActionsMarkup,
		onAction: togglePopover,
		content: activatorLabel,
		disabled,
		indicator: isNewBadgeInBadgeActions(actionSections),
		size: buttonSize
	});
	const actionsMarkup = allHiddenActions.length > 0 ? /* @__PURE__ */ React.createElement(Popover, {
		active: popoverActive,
		activator,
		preferredAlignment: "right",
		onClose: togglePopover
	}, /* @__PURE__ */ React.createElement(ActionList, {
		sections: hiddenPromotedSection.items.length > 0 ? [hiddenPromotedSection, ...allHiddenActions] : allHiddenActions,
		onActionAnyItem: togglePopover
	})) : null;
	const measurerMarkup = /* @__PURE__ */ React.createElement(BulkActionsMeasurer, {
		promotedActions,
		disabled,
		buttonSize,
		handleMeasurement
	});
	return /* @__PURE__ */ React.createElement("div", {
		className: styles$37.BulkActions,
		style: width ? { width } : void 0
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "400",
		blockAlign: "center"
	}, /* @__PURE__ */ React.createElement("div", { className: styles$37.BulkActionsSelectAllWrapper }, /* @__PURE__ */ React.createElement(CheckableButton, checkableButtonProps), paginatedSelectAllMarkup), selectMode ? /* @__PURE__ */ React.createElement("div", { className: styles$37.BulkActionsPromotedActionsWrapper }, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "100",
		blockAlign: "center"
	}, /* @__PURE__ */ React.createElement("div", { className: styles$37.BulkActionsOuterLayout }, measurerMarkup, /* @__PURE__ */ React.createElement("div", { className: classNames(styles$37.BulkActionsLayout, !hasMeasured && styles$37["BulkActionsLayout--measuring"]) }, promotedActionsMarkup)), actionsMarkup)) : null));
});
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/LegacyStack/LegacyStack.css.js
var styles$34 = {
	"LegacyStack": "Polaris-LegacyStack",
	"Item": "Polaris-LegacyStack__Item",
	"noWrap": "Polaris-LegacyStack--noWrap",
	"spacingNone": "Polaris-LegacyStack--spacingNone",
	"spacingExtraTight": "Polaris-LegacyStack--spacingExtraTight",
	"spacingTight": "Polaris-LegacyStack--spacingTight",
	"spacingBaseTight": "Polaris-LegacyStack--spacingBaseTight",
	"spacingLoose": "Polaris-LegacyStack--spacingLoose",
	"spacingExtraLoose": "Polaris-LegacyStack--spacingExtraLoose",
	"distributionLeading": "Polaris-LegacyStack--distributionLeading",
	"distributionTrailing": "Polaris-LegacyStack--distributionTrailing",
	"distributionCenter": "Polaris-LegacyStack--distributionCenter",
	"distributionEqualSpacing": "Polaris-LegacyStack--distributionEqualSpacing",
	"distributionFill": "Polaris-LegacyStack--distributionFill",
	"distributionFillEvenly": "Polaris-LegacyStack--distributionFillEvenly",
	"alignmentLeading": "Polaris-LegacyStack--alignmentLeading",
	"alignmentTrailing": "Polaris-LegacyStack--alignmentTrailing",
	"alignmentCenter": "Polaris-LegacyStack--alignmentCenter",
	"alignmentFill": "Polaris-LegacyStack--alignmentFill",
	"alignmentBaseline": "Polaris-LegacyStack--alignmentBaseline",
	"vertical": "Polaris-LegacyStack--vertical",
	"Item-fill": "Polaris-LegacyStack__Item--fill"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/LegacyStack/components/Item/Item.js
function Item$3({ children, fill }) {
	const className = classNames(styles$34.Item, fill && styles$34["Item-fill"]);
	return /* @__PURE__ */ React.createElement("div", { className }, children);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/LegacyStack/LegacyStack.js
/** @deprecated Use the BlockStack component instead */
var LegacyStack = /* @__PURE__ */ memo(function Stack({ children, vertical, spacing, distribution, alignment, wrap }) {
	const className = classNames(styles$34.LegacyStack, vertical && styles$34.vertical, spacing && styles$34[variationName("spacing", spacing)], distribution && styles$34[variationName("distribution", distribution)], alignment && styles$34[variationName("alignment", alignment)], wrap === false && styles$34.noWrap);
	const itemMarkup = elementChildren(children).map((child, index) => {
		return wrapWithComponent(child, Item$3, { key: index });
	});
	return /* @__PURE__ */ React.createElement("div", { className }, itemMarkup);
});
LegacyStack.Item = Item$3;
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ChoiceList/ChoiceList.css.js
var styles$33 = { "ChoiceChildren": "Polaris-ChoiceList__ChoiceChildren" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/RadioButton/RadioButton.css.js
var styles$32 = {
	"RadioButton": "Polaris-RadioButton",
	"Input": "Polaris-RadioButton__Input",
	"Backdrop": "Polaris-RadioButton__Backdrop",
	"ChoiceLabel": "Polaris-RadioButton__ChoiceLabel",
	"toneMagic": "Polaris-RadioButton--toneMagic"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/RadioButton/RadioButton.js
function RadioButton({ ariaDescribedBy: ariaDescribedByProp, label, labelHidden, helpText, checked, disabled, onChange, onFocus, onBlur, id: idProp, name: nameProp, value, fill, bleed, bleedBlockStart, bleedBlockEnd, bleedInlineStart, bleedInlineEnd, tone }) {
	const uniqId = useId();
	const id = idProp ?? uniqId;
	const name = nameProp || id;
	const inputNode = useRef(null);
	const handleBlur = () => {
		onBlur && onBlur();
	};
	function handleChange({ currentTarget }) {
		onChange && onChange(currentTarget.checked, id);
	}
	const describedBy = [];
	if (helpText) describedBy.push(helpTextID(id));
	if (ariaDescribedByProp) describedBy.push(ariaDescribedByProp);
	const ariaDescribedBy = describedBy.length ? describedBy.join(" ") : void 0;
	const inputClassName = classNames(styles$32.Input, tone && styles$32[variationName("tone", tone)]);
	const extraChoiceProps = {
		helpText,
		bleed,
		bleedBlockStart,
		bleedBlockEnd,
		bleedInlineStart,
		bleedInlineEnd
	};
	return /* @__PURE__ */ React.createElement(Choice, Object.assign({
		label,
		labelHidden,
		disabled,
		id,
		labelClassName: styles$32.ChoiceLabel,
		fill
	}, extraChoiceProps, checked ? { tone } : {}), /* @__PURE__ */ React.createElement("span", { className: styles$32.RadioButton }, /* @__PURE__ */ React.createElement("input", {
		id,
		name,
		value,
		type: "radio",
		checked,
		disabled,
		className: inputClassName,
		onChange: handleChange,
		onFocus,
		onBlur: handleBlur,
		"aria-describedby": ariaDescribedBy,
		ref: inputNode
	}), /* @__PURE__ */ React.createElement("span", { className: styles$32.Backdrop })));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ChoiceList/ChoiceList.js
function ChoiceList({ title, titleHidden, allowMultiple, choices, selected, onChange = noop$5, error, disabled = false, name: nameProp, tone }) {
	const ControlComponent = allowMultiple ? Checkbox$1 : RadioButton;
	const uniqName = useId();
	const name = nameProp ?? uniqName;
	const finalName = allowMultiple ? `${name}[]` : name;
	const titleMarkup = title ? /* @__PURE__ */ React.createElement(Box, {
		as: "legend",
		paddingBlockEnd: {
			xs: "0",
			md: "100"
		}
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd",
		visuallyHidden: titleHidden
	}, title)) : null;
	const choicesMarkup = choices.map((choice) => {
		const { value, id, label, helpText, disabled: choiceDisabled, describedByError } = choice;
		function handleChange(checked) {
			onChange(updateSelectedChoices(choice, checked, selected, allowMultiple), name);
		}
		const isSelected = choiceIsSelected(choice, selected);
		const renderedChildren = choice.renderChildren ? choice.renderChildren(isSelected) : null;
		const children = renderedChildren ? /* @__PURE__ */ React.createElement("div", { className: styles$33.ChoiceChildren }, /* @__PURE__ */ React.createElement(Box, { paddingBlockStart: {
			xs: "400",
			md: "0"
		} }, renderedChildren)) : null;
		return /* @__PURE__ */ React.createElement("li", { key: value }, /* @__PURE__ */ React.createElement(Bleed, { marginBlockEnd: helpText ? {
			xs: "100",
			md: "0"
		} : { xs: "0" } }, /* @__PURE__ */ React.createElement(ControlComponent, {
			name: finalName,
			value,
			id,
			label,
			disabled: choiceDisabled || disabled,
			fill: {
				xs: true,
				sm: false
			},
			checked: choiceIsSelected(choice, selected),
			helpText,
			onChange: handleChange,
			ariaDescribedBy: error && describedByError ? errorTextID(finalName) : null,
			tone
		}), children));
	});
	const errorMarkup = error && /* @__PURE__ */ React.createElement(Box, {
		paddingBlockStart: {
			xs: "0",
			md: "100"
		},
		paddingBlockEnd: "200"
	}, /* @__PURE__ */ React.createElement(InlineError, {
		message: error,
		fieldID: finalName
	}));
	return /* @__PURE__ */ React.createElement(BlockStack, {
		as: "fieldset",
		gap: {
			xs: "400",
			md: "0"
		},
		"aria-invalid": error != null,
		id: finalName
	}, titleMarkup, /* @__PURE__ */ React.createElement(BlockStack, {
		as: "ul",
		gap: {
			xs: "400",
			md: "0"
		}
	}, choicesMarkup), errorMarkup);
}
function noop$5() {}
function choiceIsSelected({ value }, selected) {
	return selected.includes(value);
}
function updateSelectedChoices({ value }, checked, selected, allowMultiple = false) {
	if (checked) return allowMultiple ? [...selected, value] : [value];
	return selected.filter((selectedChoice) => selectedChoice !== value);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/InlineGrid/InlineGrid.css.js
var styles$31 = { "InlineGrid": "Polaris-InlineGrid" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/InlineGrid/InlineGrid.js
function InlineGrid({ children, columns, gap, alignItems }) {
	const style = {
		...getResponsiveValue("inline-grid", "grid-template-columns", formatInlineGrid(columns)),
		...getResponsiveProps("inline-grid", "gap", "space", gap),
		"--pc-inline-grid-align-items": alignItems
	};
	return /* @__PURE__ */ React.createElement("div", {
		className: styles$31.InlineGrid,
		style: sanitizeCustomProperties(style)
	}, children);
}
function formatInlineGrid(columns) {
	if (typeof columns === "object" && columns !== null && !Array.isArray(columns)) return Object.fromEntries(Object.entries(columns).map(([breakpointAlias, breakpointInlineGrid]) => [breakpointAlias, getColumnValue(breakpointInlineGrid)]));
	return getColumnValue(columns);
}
function getColumnValue(columns) {
	if (!columns) return void 0;
	if (typeof columns === "number" || !isNaN(Number(columns))) return `repeat(${Number(columns)}, minmax(0, 1fr))`;
	if (typeof columns === "string") return columns;
	return columns.map((column) => {
		switch (column) {
			case "oneThird": return "minmax(0, 1fr)";
			case "oneHalf": return "minmax(0, 1fr)";
			case "twoThirds": return "minmax(0, 2fr)";
		}
	}).join(" ");
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/frame/context.js
var FrameContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/frame/hooks.js
function useFrame() {
	const frame = useContext(FrameContext);
	if (!frame) throw new Error("No Frame context was provided. Your component must be wrapped in a <Frame> component. See https://polaris.shopify.com/components/internal-only/frame for implementation instructions.");
	return frame;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/is-input-focused.js
var EditableTarget = /* @__PURE__ */ function(EditableTarget) {
	EditableTarget["Input"] = "INPUT";
	EditableTarget["Textarea"] = "TEXTAREA";
	EditableTarget["Select"] = "SELECT";
	EditableTarget["ContentEditable"] = "contenteditable";
	return EditableTarget;
}(EditableTarget || {});
function isInputFocused() {
	if (document == null || document.activeElement == null) return false;
	const { tagName } = document.activeElement;
	return tagName === EditableTarget.Input || tagName === EditableTarget.Textarea || tagName === EditableTarget.Select || document.activeElement.hasAttribute(EditableTarget.ContentEditable);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Pagination/Pagination.css.js
var styles$30 = {
	"Pagination": "Polaris-Pagination",
	"table": "Polaris-Pagination--table",
	"TablePaginationActions": "Polaris-Pagination__TablePaginationActions"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Pagination/Pagination.js
function Pagination({ hasNext, hasPrevious, nextURL, previousURL, onNext, onPrevious, nextTooltip, previousTooltip, nextKeys, previousKeys, accessibilityLabel, accessibilityLabels, label, type = "page" }) {
	const i18n = useI18n();
	const node = /* @__PURE__ */ createRef();
	const navLabel = accessibilityLabel || i18n.translate("Polaris.Pagination.pagination");
	const previousLabel = accessibilityLabels?.previous || i18n.translate("Polaris.Pagination.previous");
	const nextLabel = accessibilityLabels?.next || i18n.translate("Polaris.Pagination.next");
	const prev = /* @__PURE__ */ React.createElement(Button, {
		icon: SvgChevronLeftIcon,
		accessibilityLabel: previousLabel,
		url: previousURL,
		onClick: onPrevious,
		disabled: !hasPrevious,
		id: "previousURL"
	});
	const constructedPrevious = previousTooltip && hasPrevious ? /* @__PURE__ */ React.createElement(Tooltip, {
		activatorWrapper: "span",
		content: previousTooltip,
		preferredPosition: "below"
	}, prev) : prev;
	const next = /* @__PURE__ */ React.createElement(Button, {
		icon: SvgChevronRightIcon,
		accessibilityLabel: nextLabel,
		url: nextURL,
		onClick: onNext,
		disabled: !hasNext,
		id: "nextURL"
	});
	const constructedNext = nextTooltip && hasNext ? /* @__PURE__ */ React.createElement(Tooltip, {
		activatorWrapper: "span",
		content: nextTooltip,
		preferredPosition: "below"
	}, next) : next;
	const previousHandler = onPrevious || noop$4;
	const previousButtonEvents = previousKeys && (previousURL || onPrevious) && hasPrevious && previousKeys.map((key) => /* @__PURE__ */ React.createElement(KeypressListener, {
		key,
		keyCode: key,
		handler: previousURL ? handleCallback(clickPaginationLink("previousURL", node)) : handleCallback(previousHandler)
	}));
	const nextHandler = onNext || noop$4;
	const nextButtonEvents = nextKeys && (nextURL || onNext) && hasNext && nextKeys.map((key) => /* @__PURE__ */ React.createElement(KeypressListener, {
		key,
		keyCode: key,
		handler: nextURL ? handleCallback(clickPaginationLink("nextURL", node)) : handleCallback(nextHandler)
	}));
	if (type === "table") {
		const labelMarkup = label ? /* @__PURE__ */ React.createElement(Box, {
			padding: "300",
			paddingBlockStart: "0",
			paddingBlockEnd: "0"
		}, /* @__PURE__ */ React.createElement(Text, {
			as: "span",
			variant: "bodySm",
			fontWeight: "medium"
		}, label)) : null;
		return /* @__PURE__ */ React.createElement("nav", {
			"aria-label": navLabel,
			ref: node,
			className: classNames(styles$30.Pagination, styles$30.table)
		}, previousButtonEvents, nextButtonEvents, /* @__PURE__ */ React.createElement(Box, {
			background: "bg-surface-secondary",
			paddingBlockStart: "150",
			paddingBlockEnd: "150",
			paddingInlineStart: "300",
			paddingInlineEnd: "200"
		}, /* @__PURE__ */ React.createElement(InlineStack, {
			align: "center",
			blockAlign: "center"
		}, /* @__PURE__ */ React.createElement("div", {
			className: styles$30.TablePaginationActions,
			"data-buttongroup-variant": "segmented"
		}, /* @__PURE__ */ React.createElement("div", null, constructedPrevious), labelMarkup, /* @__PURE__ */ React.createElement("div", null, constructedNext)))));
	}
	const labelTextMarkup = hasNext && hasPrevious ? /* @__PURE__ */ React.createElement("span", null, label) : /* @__PURE__ */ React.createElement(Text, {
		tone: "subdued",
		as: "span"
	}, label);
	const labelMarkup = label ? /* @__PURE__ */ React.createElement(Box, {
		padding: "300",
		paddingBlockStart: "0",
		paddingBlockEnd: "0"
	}, /* @__PURE__ */ React.createElement("div", { "aria-live": "polite" }, labelTextMarkup)) : null;
	return /* @__PURE__ */ React.createElement("nav", {
		"aria-label": navLabel,
		ref: node,
		className: styles$30.Pagination
	}, previousButtonEvents, nextButtonEvents, /* @__PURE__ */ React.createElement(ButtonGroup, { variant: "segmented" }, constructedPrevious, labelMarkup, constructedNext));
}
function clickPaginationLink(id, node) {
	return () => {
		if (node.current == null) return;
		const link = node.current.querySelector(`#${id}`);
		if (link) link.click();
	};
}
function handleCallback(fn) {
	return () => {
		if (isInputFocused()) return;
		fn();
	};
}
function noop$4() {}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/AfterInitialMount/AfterInitialMount.js
function AfterInitialMount({ children, onMount, fallback = null }) {
	const isMounted = useIsAfterInitialMount();
	const content = isMounted ? children : fallback;
	useEffect(() => {
		if (isMounted && onMount) onMount();
	}, [isMounted, onMount]);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, content);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/sticky-manager/hooks.js
function useStickyManager() {
	const stickyManager = useContext(StickyManagerContext);
	if (!stickyManager) throw new MissingAppProviderError("No StickyManager was provided.");
	return stickyManager;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Sticky/Sticky.js
var StickyInner = class extends Component {
	constructor(...args) {
		super(...args);
		this.state = {
			isSticky: false,
			style: {}
		};
		this.placeHolderNode = null;
		this.stickyNode = null;
		this.setPlaceHolderNode = (node) => {
			this.placeHolderNode = node;
		};
		this.setStickyNode = (node) => {
			this.stickyNode = node;
		};
		this.handlePositioning = (stick, top = 0, left = 0, width = 0) => {
			const { isSticky } = this.state;
			if (stick && !isSticky || !stick && isSticky) {
				this.adjustPlaceHolderNode(stick);
				this.setState({ isSticky: !isSticky }, () => {
					if (this.props.onStickyChange == null) return null;
					this.props.onStickyChange(!isSticky);
					if (this.props.boundingElement == null) return null;
					this.props.boundingElement.toggleAttribute("data-sticky-active");
				});
			}
			const style = stick ? {
				position: "fixed",
				top,
				left,
				width
			} : {};
			this.setState({ style });
		};
		this.adjustPlaceHolderNode = (add) => {
			if (this.placeHolderNode && this.stickyNode) this.placeHolderNode.style.paddingBottom = add ? `${getRectForNode(this.stickyNode).height}px` : "0px";
		};
	}
	componentDidMount() {
		const { boundingElement, offset = false, disableWhenStacked = false, stickyManager } = this.props;
		if (!this.stickyNode || !this.placeHolderNode) return;
		stickyManager.registerStickyItem({
			stickyNode: this.stickyNode,
			placeHolderNode: this.placeHolderNode,
			handlePositioning: this.handlePositioning,
			offset,
			boundingElement,
			disableWhenStacked
		});
	}
	componentDidUpdate() {
		const { boundingElement, offset = false, disableWhenStacked = false, stickyManager } = this.props;
		if (!this.stickyNode || !this.placeHolderNode) return;
		const stickyManagerItem = stickyManager.getStickyItem(this.stickyNode);
		if (!(!stickyManagerItem || boundingElement !== stickyManagerItem.boundingElement || offset !== stickyManagerItem.offset || disableWhenStacked !== stickyManagerItem.disableWhenStacked)) return;
		stickyManager.unregisterStickyItem(this.stickyNode);
		stickyManager.registerStickyItem({
			stickyNode: this.stickyNode,
			placeHolderNode: this.placeHolderNode,
			handlePositioning: this.handlePositioning,
			offset,
			boundingElement,
			disableWhenStacked
		});
	}
	componentWillUnmount() {
		const { stickyManager } = this.props;
		if (!this.stickyNode) return;
		stickyManager.unregisterStickyItem(this.stickyNode);
	}
	render() {
		const { style, isSticky } = this.state;
		const { children } = this.props;
		const childrenContent = isFunction(children) ? children(isSticky) : children;
		return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { ref: this.setPlaceHolderNode }), /* @__PURE__ */ React.createElement("div", {
			ref: this.setStickyNode,
			style
		}, childrenContent));
	}
};
function isFunction(arg) {
	return typeof arg === "function";
}
function Sticky(props) {
	const stickyManager = useStickyManager();
	return /* @__PURE__ */ React.createElement(StickyInner, Object.assign({}, props, { stickyManager }));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Divider/Divider.css.js
var styles$29 = { "Divider": "Polaris-Divider" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Divider/Divider.js
var Divider = ({ borderColor = "border-secondary", borderWidth = "025" }) => {
	const borderColorValue = borderColor === "transparent" ? borderColor : `var(--p-color-${borderColor})`;
	return /* @__PURE__ */ React.createElement("hr", {
		className: styles$29.Divider,
		style: { borderBlockStart: `var(--p-border-width-${borderWidth}) solid ${borderColorValue}` }
	});
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/EmptySearchResult/illustrations/empty-search.svg.js
var emptySearch = "data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' d='M41.87 24a17.87 17.87 0 11-35.74 0 17.87 17.87 0 0135.74 0zm-3.15 18.96a24 24 0 114.24-4.24L59.04 54.8a3 3 0 11-4.24 4.24L38.72 42.96z' fill='%238C9196'/%3e%3c/svg%3e";
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/EmptySearchResult/EmptySearchResult.js
function EmptySearchResult({ title, description, withIllustration }) {
	const altText = useI18n().translate("Polaris.EmptySearchResult.altText");
	const descriptionMarkup = description ? /* @__PURE__ */ React.createElement("p", null, description) : null;
	const illustrationMarkup = withIllustration ? /* @__PURE__ */ React.createElement(Image, {
		alt: altText,
		source: emptySearch,
		draggable: false
	}) : null;
	return /* @__PURE__ */ React.createElement(LegacyStack, {
		alignment: "center",
		vertical: true
	}, illustrationMarkup, /* @__PURE__ */ React.createElement(Text, {
		variant: "headingLg",
		as: "p"
	}, title), /* @__PURE__ */ React.createElement(Text, {
		tone: "subdued",
		as: "span"
	}, descriptionMarkup));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Filters/Filters.css.js
var styles$28 = {
	"Container": "Polaris-Filters__Container",
	"SearchField": "Polaris-Filters__SearchField",
	"FiltersWrapper": "Polaris-Filters__FiltersWrapper",
	"hideQueryField": "Polaris-Filters--hideQueryField",
	"FiltersInner": "Polaris-Filters__FiltersInner",
	"AddFilter": "Polaris-Filters__AddFilter",
	"FiltersWrapperWithAddButton": "Polaris-Filters__FiltersWrapperWithAddButton",
	"AddFilterActivatorMultiple": "Polaris-Filters__AddFilterActivatorMultiple",
	"FiltersStickyArea": "Polaris-Filters__FiltersStickyArea",
	"ClearAll": "Polaris-Filters__ClearAll",
	"MultiplePinnedFilterClearAll": "Polaris-Filters__MultiplePinnedFilterClearAll"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Filters/components/SearchField/SearchField.js
function SearchField({ onChange, onClear, onFocus, onBlur, focused, value, placeholder, disabled, borderlessQueryField, loading, selectedViewName }) {
	const i18n = useI18n();
	const id = useId();
	const { mdUp } = useBreakpoints();
	const suffix = value && selectedViewName && mdUp ? /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd",
		tone: "subdued"
	}, i18n.translate("Polaris.Filters.searchInView", { viewName: selectedViewName })) : null;
	function handleChange(eventValue) {
		onChange(eventValue ?? value);
	}
	function handleClear() {
		if (onClear) onClear();
		else onChange("");
	}
	return /* @__PURE__ */ React.createElement(TextField, {
		id,
		value,
		onChange: handleChange,
		onFocus,
		onBlur,
		onClearButtonClick: handleClear,
		autoComplete: "off",
		placeholder,
		disabled,
		variant: borderlessQueryField ? "borderless" : "inherit",
		size: "slim",
		prefix: mdUp ? /* @__PURE__ */ React.createElement(Icon, { source: SvgSearchIcon }) : void 0,
		suffix,
		focused,
		label: placeholder,
		labelHidden: true,
		clearButton: true,
		autoSize: Boolean(suffix),
		loading
	});
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-on-value-change.js
function useOnValueChange(value, onChange) {
	const tracked = React.useRef(value);
	useEffect(() => {
		const oldValue = tracked.current;
		if (value !== tracked.current) {
			tracked.current = value;
			onChange(value, oldValue);
		}
	}, [value, onChange]);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Filters/components/FilterPill/FilterPill.css.js
var styles$27 = {
	"FilterButton": "Polaris-Filters-FilterPill__FilterButton",
	"focusedFilterButton": "Polaris-Filters-FilterPill--focusedFilterButton",
	"ActiveFilterButton": "Polaris-Filters-FilterPill__ActiveFilterButton",
	"PlainButton": "Polaris-Filters-FilterPill__PlainButton",
	"ToggleButton": "Polaris-Filters-FilterPill__ToggleButton",
	"clearButton": "Polaris-Filters-FilterPill--clearButton",
	"IconWrapper": "Polaris-Filters-FilterPill__IconWrapper",
	"PopoverWrapper": "Polaris-Filters-FilterPill__PopoverWrapper",
	"ClearButtonWrapper": "Polaris-Filters-FilterPill__ClearButtonWrapper"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Filters/components/FilterPill/FilterPill.js
function FilterPill({ unsavedChanges = false, filterKey, label, filter, disabled, hideClearButton, selected, initialActive, disclosureZIndexOverride, closeOnChildOverlayClick, onRemove, onClick }) {
	const i18n = useI18n();
	const elementRef = useRef(null);
	const { value: focused, setTrue: setFocusedTrue, setFalse: setFocusedFalse } = useToggle(false);
	const [popoverActive, setPopoverActive] = useState(initialActive);
	useEffect(() => {
		const node = elementRef.current;
		if (!node || !popoverActive) return;
		const parent = node.parentElement?.parentElement;
		if (!parent) return;
		parent.scroll?.({ left: node.offsetLeft });
	}, [elementRef, popoverActive]);
	const togglePopoverActive = useCallback(() => {
		if (filter) setPopoverActive((popoverActive) => !popoverActive);
		if (onClick) onClick(filterKey);
	}, [
		filter,
		filterKey,
		onClick
	]);
	const handlePopoverClose = useCallback(() => {
		togglePopoverActive();
		if (!selected) onRemove?.(filterKey);
	}, [
		onRemove,
		selected,
		filterKey,
		togglePopoverActive
	]);
	const handleClear = () => {
		if (onRemove) onRemove(filterKey);
		setPopoverActive(false);
	};
	const buttonClasses = classNames(styles$27.FilterButton, selected && styles$27.ActiveFilterButton, popoverActive && styles$27.FocusFilterButton, focused && styles$27.focusedFilterButton);
	const clearButtonClassNames = classNames(styles$27.PlainButton, styles$27.clearButton);
	const toggleButtonClassNames = classNames(styles$27.PlainButton, styles$27.ToggleButton);
	const disclosureMarkup = !selected ? /* @__PURE__ */ React.createElement("div", { className: styles$27.IconWrapper }, /* @__PURE__ */ React.createElement(Icon, {
		source: SvgChevronDownIcon,
		tone: "base"
	})) : null;
	const labelMarkup = /* @__PURE__ */ React.createElement(Box, { paddingInlineStart: unsavedChanges ? "0" : "050" }, /* @__PURE__ */ React.createElement(InlineStack, null, /* @__PURE__ */ React.createElement(Text, {
		variant: "bodySm",
		as: "span"
	}, label)));
	const unsavedPip = unsavedChanges ? /* @__PURE__ */ React.createElement(Box, { paddingInlineEnd: "150" }, /* @__PURE__ */ React.createElement(Box, {
		background: "bg-fill-emphasis",
		borderRadius: "050",
		width: "6px",
		minHeight: "6px"
	})) : null;
	const removeFilterButtonMarkup = selected ? /* @__PURE__ */ React.createElement(UnstyledButton, {
		onClick: handleClear,
		className: clearButtonClassNames,
		type: "button",
		"aria-label": i18n.translate("Polaris.FilterPill.clear")
	}, /* @__PURE__ */ React.createElement("div", { className: styles$27.IconWrapper }, /* @__PURE__ */ React.createElement(Icon, {
		source: SvgXSmallIcon,
		tone: "base"
	}))) : null;
	const activator = /* @__PURE__ */ React.createElement("div", { className: buttonClasses }, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "0",
		wrap: false
	}, /* @__PURE__ */ React.createElement(UnstyledButton, {
		onFocus: setFocusedTrue,
		onBlur: setFocusedFalse,
		onClick: togglePopoverActive,
		className: toggleButtonClassNames,
		type: "button",
		accessibilityLabel: unsavedChanges ? i18n.translate("Polaris.FilterPill.unsavedChanges", { label }) : label
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		wrap: false,
		align: "center",
		blockAlign: "center",
		gap: "0"
	}, unsavedPip, labelMarkup, disclosureMarkup)), removeFilterButtonMarkup));
	const clearButtonMarkup = !hideClearButton && /* @__PURE__ */ React.createElement("div", { className: styles$27.ClearButtonWrapper }, /* @__PURE__ */ React.createElement(Button, {
		onClick: handleClear,
		variant: "plain",
		disabled: !selected,
		textAlign: "left"
	}, i18n.translate("Polaris.FilterPill.clear")));
	if (disabled) return null;
	return /* @__PURE__ */ React.createElement("div", { ref: elementRef }, /* @__PURE__ */ React.createElement(Popover, {
		active: popoverActive,
		activator,
		key: filterKey,
		onClose: handlePopoverClose,
		preferredAlignment: "left",
		zIndexOverride: disclosureZIndexOverride,
		preventCloseOnChildOverlayClick: !closeOnChildOverlayClick
	}, /* @__PURE__ */ React.createElement("div", { className: styles$27.PopoverWrapper }, /* @__PURE__ */ React.createElement(Popover.Section, null, /* @__PURE__ */ React.createElement(BlockStack, { gap: "100" }, filter, clearButtonMarkup)))));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Filters/components/FiltersBar/FiltersBar.js
function FiltersBar({ filters, appliedFilters, onClearAll, disabled, hideQueryField, disableFilters, mountedStateStyles, onAddFilterClick, closeOnChildOverlayClick, children }) {
	const i18n = useI18n();
	const [popoverActive, setPopoverActive] = useState(false);
	const hasMounted = useRef(false);
	useEffect(() => {
		hasMounted.current = true;
	});
	const togglePopoverActive = () => setPopoverActive((popoverActive) => !popoverActive);
	const handleAddFilterClick = () => {
		onAddFilterClick?.();
		togglePopoverActive();
	};
	const appliedFilterKeys = appliedFilters?.map(({ key }) => key);
	const pinnedFromPropsKeys = filters.filter(({ pinned }) => pinned).map(({ key }) => key);
	const pinnedFiltersFromPropsAndAppliedFilters = filters.filter(({ pinned, key }) => {
		return Boolean(pinned) || appliedFilterKeys?.includes(key);
	});
	const [localPinnedFilters, setLocalPinnedFilters] = useState(pinnedFiltersFromPropsAndAppliedFilters.map(({ key }) => key));
	useOnValueChange(filters.length, () => {
		setLocalPinnedFilters(pinnedFiltersFromPropsAndAppliedFilters.map(({ key }) => key));
	});
	const pinnedFilters = localPinnedFilters.map((key) => filters.find((filter) => filter.key === key)).reduce((acc, filter) => filter ? [...acc, filter] : acc, []);
	const onFilterClick = ({ key, onAction }) => () => {
		setTimeout(() => {
			setLocalPinnedFilters((currentLocalPinnedFilters) => [...new Set([...currentLocalPinnedFilters, key])]);
			onAction?.();
			togglePopoverActive();
		}, 0);
	};
	const filterToActionItem = (filter) => ({
		...filter,
		content: filter.label,
		onAction: onFilterClick(filter)
	});
	const unpinnedFilters = filters.filter((filter) => !pinnedFilters.some(({ key }) => key === filter.key));
	const unsectionedFilters = unpinnedFilters.filter((filter) => !filter.section && !filter.hidden).map(filterToActionItem);
	const sectionedFilters = unpinnedFilters.filter((filter) => filter.section).reduce((acc, filter) => {
		const filterActionItem = filterToActionItem(filter);
		const sectionIndex = acc.findIndex((section) => section.title === filter.section);
		if (sectionIndex === -1) acc.push({
			title: filter.section,
			items: [filterActionItem]
		});
		else acc[sectionIndex].items.push(filterActionItem);
		return acc;
	}, []);
	const hasOneOrMorePinnedFilters = pinnedFilters.length >= 1;
	const addFilterActivator = /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(UnstyledButton, {
		type: "button",
		className: styles$28.AddFilter,
		onClick: handleAddFilterClick,
		"aria-label": i18n.translate("Polaris.Filters.addFilter"),
		disabled: disabled || unsectionedFilters.length === 0 && sectionedFilters.length === 0 || disableFilters
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodySm",
		tone: disabled ? "disabled" : "base"
	}, i18n.translate("Polaris.Filters.addFilter"), " "), /* @__PURE__ */ React.createElement(SvgPlusIcon, null)));
	const handleClearAllFilters = () => {
		setLocalPinnedFilters(pinnedFromPropsKeys);
		onClearAll?.();
	};
	const shouldShowAddButton = filters.some((filter) => !filter.pinned) || filters.length !== localPinnedFilters.length;
	const pinnedFiltersMarkup = pinnedFilters.map(({ key: filterKey, ...pinnedFilter }) => {
		const appliedFilter = appliedFilters?.find(({ key }) => key === filterKey);
		const handleFilterPillRemove = () => {
			setLocalPinnedFilters((currentLocalPinnedFilters) => currentLocalPinnedFilters.filter((key) => {
				const isMatchedFilters = key === filterKey;
				const isPinnedFilterFromProps = pinnedFromPropsKeys.includes(key);
				return !isMatchedFilters || isPinnedFilterFromProps;
			}));
			appliedFilter?.onRemove(filterKey);
		};
		return /* @__PURE__ */ React.createElement(FilterPill, Object.assign({ key: filterKey }, pinnedFilter, {
			initialActive: hasMounted.current && !pinnedFilter.pinned && !appliedFilter,
			unsavedChanges: appliedFilter?.unsavedChanges,
			label: appliedFilter?.label || pinnedFilter.label,
			filterKey,
			selected: appliedFilterKeys?.includes(filterKey),
			onRemove: handleFilterPillRemove,
			disabled: pinnedFilter.disabled || disableFilters,
			closeOnChildOverlayClick
		}));
	});
	const addButton = shouldShowAddButton ? /* @__PURE__ */ React.createElement("div", { className: classNames(styles$28.AddFilterActivator, hasOneOrMorePinnedFilters && styles$28.AddFilterActivatorMultiple) }, /* @__PURE__ */ React.createElement(Popover, {
		active: popoverActive && !disabled,
		activator: addFilterActivator,
		onClose: togglePopoverActive
	}, /* @__PURE__ */ React.createElement(ActionList, {
		actionRole: "menuitem",
		items: unsectionedFilters,
		sections: sectionedFilters
	}))) : null;
	const clearAllMarkup = appliedFilters?.length ? /* @__PURE__ */ React.createElement("div", { className: classNames(styles$28.ClearAll, hasOneOrMorePinnedFilters && shouldShowAddButton && styles$28.MultiplePinnedFilterClearAll) }, /* @__PURE__ */ React.createElement(Button, {
		size: "micro",
		onClick: handleClearAllFilters,
		variant: "monochromePlain"
	}, i18n.translate("Polaris.Filters.clearFilters"))) : null;
	return /* @__PURE__ */ React.createElement("div", {
		className: classNames(styles$28.FiltersWrapper, shouldShowAddButton && hasOneOrMorePinnedFilters && styles$28.FiltersWrapperWithAddButton),
		"aria-live": "polite",
		style: mountedStateStyles
	}, /* @__PURE__ */ React.createElement("div", { className: classNames(styles$28.FiltersInner) }, /* @__PURE__ */ React.createElement("div", { className: classNames(styles$28.FiltersStickyArea) }, pinnedFiltersMarkup, addButton, clearAllMarkup)), hideQueryField ? /* @__PURE__ */ React.createElement(Box, {
		paddingInlineEnd: "300",
		paddingBlockStart: "200",
		paddingBlockEnd: "200"
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		align: "start",
		blockAlign: "center",
		gap: {
			xs: "400",
			md: "300"
		}
	}, children)) : null);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Filters/Filters.js
var TRANSITION_DURATION$1 = "var(--p-motion-duration-150)";
var TRANSITION_MARGIN = "-36px";
var defaultStyle$1 = {
	transition: `opacity ${TRANSITION_DURATION$1} var(--p-motion-ease)`,
	opacity: 0
};
var transitionStyles$1 = {
	entering: { opacity: 1 },
	entered: { opacity: 1 },
	exiting: { opacity: 0 },
	exited: { opacity: 0 },
	unmounted: { opacity: 0 }
};
var defaultFilterStyles = {
	transition: `opacity ${TRANSITION_DURATION$1} var(--p-motion-ease), margin ${TRANSITION_DURATION$1} var(--p-motion-ease)`,
	opacity: 0,
	marginTop: TRANSITION_MARGIN
};
var transitionFilterStyles = {
	entering: {
		opacity: 1,
		marginTop: 0
	},
	entered: {
		opacity: 1,
		marginTop: 0
	},
	exiting: {
		opacity: 0,
		marginTop: TRANSITION_MARGIN
	},
	exited: {
		opacity: 0,
		marginTop: TRANSITION_MARGIN
	},
	unmounted: {
		opacity: 0,
		marginTop: TRANSITION_MARGIN
	}
};
function Filters({ queryValue, queryPlaceholder, focused, filters, appliedFilters, onQueryChange, onQueryClear, onQueryBlur, onQueryFocus, onClearAll, children, disabled, hideFilters, hideQueryField, disableQueryField, borderlessQueryField, loading, disableFilters, mountedState, onAddFilterClick, closeOnChildOverlayClick, selectedViewName }) {
	const hideFilterBar = hideFilters || filters.length === 0;
	const queryFieldMarkup = hideQueryField ? null : /* @__PURE__ */ React.createElement("div", { className: styles$28.Container }, /* @__PURE__ */ React.createElement(Box, { padding: "200" }, /* @__PURE__ */ React.createElement(InlineStack, {
		align: "start",
		blockAlign: "center",
		gap: {
			xs: "400",
			md: "300"
		}
	}, /* @__PURE__ */ React.createElement("div", {
		className: styles$28.SearchField,
		style: mountedState ? {
			...defaultStyle$1,
			...transitionStyles$1[mountedState]
		} : void 0
	}, /* @__PURE__ */ React.createElement(SearchField, {
		onChange: onQueryChange,
		onFocus: onQueryFocus,
		onBlur: onQueryBlur,
		onClear: onQueryClear,
		value: queryValue,
		placeholder: queryPlaceholder,
		focused,
		disabled: disabled || disableQueryField,
		borderlessQueryField,
		loading,
		selectedViewName
	})), children)));
	const mountedStateStyles = mountedState && !hideQueryField ? {
		...defaultFilterStyles,
		...transitionFilterStyles[mountedState]
	} : void 0;
	const filtersMarkup = hideFilterBar ? null : /* @__PURE__ */ React.createElement(FiltersBar, {
		filters,
		appliedFilters,
		onClearAll,
		disabled,
		hideQueryField,
		disableFilters,
		onAddFilterClick,
		closeOnChildOverlayClick,
		mountedStateStyles
	}, children);
	return /* @__PURE__ */ React.createElement("div", { className: classNames(styles$28.Filters, hideQueryField && styles$28.hideQueryField) }, queryFieldMarkup, filtersMarkup);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Focus/Focus.js
var Focus = /* @__PURE__ */ memo(function Focus({ children, disabled, root }) {
	useEffect(() => {
		if (disabled || !root) return;
		const node = isRef$1(root) ? root.current : root;
		if (!node || node.querySelector("[autofocus]")) return;
		focusFirstFocusableNode(node, false);
	}, [disabled, root]);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, children);
});
function isRef$1(ref) {
	return ref.current !== void 0;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Form/Form.js
function Form$1({ acceptCharset, action, autoComplete, children, encType, implicitSubmit = true, method = "post", name, noValidate, preventDefault = true, target, onSubmit }) {
	const i18n = useI18n();
	const handleSubmit = useCallback((event) => {
		if (!preventDefault) return;
		event.preventDefault();
		onSubmit(event);
	}, [onSubmit, preventDefault]);
	const autoCompleteInputs = normalizeAutoComplete(autoComplete);
	const submitMarkup = implicitSubmit ? /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		visuallyHidden: true
	}, /* @__PURE__ */ React.createElement("button", {
		type: "submit",
		"aria-hidden": "true",
		tabIndex: -1
	}, i18n.translate("Polaris.Common.submit"))) : null;
	return /* @__PURE__ */ React.createElement("form", {
		acceptCharset,
		action,
		autoComplete: autoCompleteInputs,
		encType,
		method,
		name,
		noValidate,
		target,
		onSubmit: handleSubmit
	}, submitMarkup, children);
}
function normalizeAutoComplete(autoComplete) {
	if (autoComplete == null) return autoComplete;
	return autoComplete ? "on" : "off";
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/FormLayout/FormLayout.css.js
var styles$26 = {
	"Item": "Polaris-FormLayout__Item",
	"grouped": "Polaris-FormLayout--grouped",
	"condensed": "Polaris-FormLayout--condensed"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/FormLayout/components/Item/Item.js
function Item$2({ children, condensed = false }) {
	const className = classNames(styles$26.Item, condensed ? styles$26.condensed : styles$26.grouped);
	return children ? /* @__PURE__ */ React.createElement("div", { className }, children) : null;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/FormLayout/components/Group/Group.js
function Group({ children, condensed, title, helpText }) {
	const id = useId();
	let helpTextElement = null;
	let helpTextId;
	let titleElement = null;
	let titleId;
	if (helpText) {
		helpTextId = `${id}HelpText`;
		helpTextElement = /* @__PURE__ */ React.createElement(Box, {
			id: helpTextId,
			color: "text-secondary"
		}, helpText);
	}
	if (title) {
		titleId = `${id}Title`;
		titleElement = /* @__PURE__ */ React.createElement(Text, {
			id: titleId,
			as: "p"
		}, title);
	}
	const itemsMarkup = Children.map(children, (child) => wrapWithComponent(child, Item$2, { condensed }));
	return /* @__PURE__ */ React.createElement(BlockStack, {
		role: "group",
		gap: "200",
		"aria-labelledby": titleId,
		"aria-describedby": helpTextId
	}, titleElement, /* @__PURE__ */ React.createElement(InlineStack, { gap: "300" }, itemsMarkup), helpTextElement);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/FormLayout/FormLayout.js
var FormLayout = /* @__PURE__ */ memo(function FormLayout({ children }) {
	return /* @__PURE__ */ React.createElement(BlockStack, { gap: "400" }, Children.map(children, wrapChildren));
});
FormLayout.Group = Group;
function wrapChildren(child, index) {
	if (isElementOfType(child, Group)) return child;
	return wrapWithComponent(child, Item$2, { key: index });
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/set-root-property.js
function setRootProperty(name, value, node) {
	if (!document) return;
	(node || document.documentElement).style.setProperty(name, value);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/Frame.css.js
var styles$25 = {
	"Frame": "Polaris-Frame",
	"ScrollbarAlwaysVisible": "Polaris-Frame__ScrollbarAlwaysVisible",
	"Navigation": "Polaris-Frame__Navigation",
	"hasTopBar": "Polaris-Frame--hasTopBar",
	"Navigation-enter": "Polaris-Frame__Navigation--enter",
	"Navigation-enterActive": "Polaris-Frame__Navigation--enterActive",
	"Navigation-exit": "Polaris-Frame__Navigation--exit",
	"Navigation-exitActive": "Polaris-Frame__Navigation--exitActive",
	"NavigationDismiss": "Polaris-Frame__NavigationDismiss",
	"Navigation-visible": "Polaris-Frame__Navigation--visible",
	"TopBar": "Polaris-Frame__TopBar",
	"ContextualSaveBar": "Polaris-Frame__ContextualSaveBar",
	"Main": "Polaris-Frame__Main",
	"hasNav": "Polaris-Frame--hasNav",
	"Content": "Polaris-Frame__Content",
	"hasSidebar": "Polaris-Frame--hasSidebar",
	"GlobalRibbonContainer": "Polaris-Frame__GlobalRibbonContainer",
	"LoadingBar": "Polaris-Frame__LoadingBar",
	"Skip": "Polaris-Frame__Skip",
	"focused": "Polaris-Frame--focused",
	"pressed": "Polaris-Frame--pressed"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/media-query/hooks.js
function useMediaQuery() {
	const mediaQuery = useContext(MediaQueryContext);
	if (!mediaQuery) throw new Error("No mediaQuery was provided. Your application must be wrapped in an <AppProvider> component. See https://polaris.shopify.com/components/app-provider for implementation instructions.");
	return mediaQuery;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-is-mounted-ref.js
/**
* Returns a MutatableRefObject containing a boolean value that
* represents a components mounted status.
* @returns MutableRefObject<boolean> The mounted status
*/
function useIsMountedRef() {
	const isMounted = useRef(false);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);
	return isMounted;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/components/Loading/Loading.css.js
var styles$24 = {
	"Loading": "Polaris-Frame-Loading",
	"Level": "Polaris-Frame-Loading__Level"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/components/Loading/Loading.js
var STUCK_THRESHOLD = 99;
function Loading() {
	const i18n = useI18n();
	const isMountedRef = useIsMountedRef();
	const [progress, setProgress] = useState(0);
	const [animating, setAnimating] = useState(false);
	useEffect(() => {
		if (progress >= STUCK_THRESHOLD || animating) return;
		requestAnimationFrame(() => {
			if (!isMountedRef.current) return;
			const step = Math.max((STUCK_THRESHOLD - progress) / 10, 1);
			setAnimating(true);
			setProgress(progress + step);
		});
	}, [
		progress,
		animating,
		isMountedRef
	]);
	const customStyles = { transform: `scaleX(${Math.floor(progress) / 100})` };
	return /* @__PURE__ */ React.createElement("div", {
		className: styles$24.Loading,
		"aria-valuenow": progress,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		role: "progressbar",
		"aria-label": i18n.translate("Polaris.Loading.label")
	}, /* @__PURE__ */ React.createElement("div", {
		className: styles$24.Level,
		style: customStyles,
		onTransitionEnd: () => setAnimating(false)
	}));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/components/CSSAnimation/CSSAnimation.css.js
var styles$23 = {
	"startFade": "Polaris-Frame-CSSAnimation--startFade",
	"endFade": "Polaris-Frame-CSSAnimation--endFade"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/components/CSSAnimation/CSSAnimation.js
var TransitionStatus = /* @__PURE__ */ function(TransitionStatus) {
	TransitionStatus["Entering"] = "entering";
	TransitionStatus["Entered"] = "entered";
	TransitionStatus["Exiting"] = "exiting";
	TransitionStatus["Exited"] = "exited";
	return TransitionStatus;
}(TransitionStatus || {});
function CSSAnimation({ in: inProp, className, type, children }) {
	const [transitionStatus, setTransitionStatus] = useState(inProp ? TransitionStatus.Entering : TransitionStatus.Exited);
	const isMounted = useRef(false);
	const node = useRef(null);
	useEffect(() => {
		if (!isMounted.current) return;
		transitionStatus === TransitionStatus.Entering && changeTransitionStatus(TransitionStatus.Entered);
	}, [transitionStatus]);
	useEffect(() => {
		if (!isMounted.current) return;
		inProp && changeTransitionStatus(TransitionStatus.Entering);
		!inProp && changeTransitionStatus(TransitionStatus.Exiting);
	}, [inProp]);
	useEffect(() => {
		isMounted.current = true;
	}, []);
	const wrapperClassName = classNames(className, styles$23[variationName("start", type)], inProp && styles$23[variationName("end", type)]);
	const content = transitionStatus === TransitionStatus.Exited && !inProp ? null : children;
	return /* @__PURE__ */ React.createElement("div", {
		className: wrapperClassName,
		ref: node,
		onTransitionEnd: handleTransitionEnd
	}, content);
	function handleTransitionEnd() {
		transitionStatus === TransitionStatus.Exiting && changeTransitionStatus(TransitionStatus.Exited);
	}
	function changeTransitionStatus(transitionStatus) {
		setTransitionStatus(transitionStatus);
		if (transitionStatus === TransitionStatus.Entering) node.current && node.current.getBoundingClientRect();
	}
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/pluck-deep.js
function pluckDeep(obj, key) {
	if (!obj) return null;
	const keys = Object.keys(obj);
	for (const currKey of keys) {
		if (currKey === key) return obj[key];
		if (isObject(obj[currKey])) {
			const plucked = pluckDeep(obj[currKey], key);
			if (plucked) return plucked;
		}
	}
	return null;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/get-width.js
function getWidth(value = {}, defaultWidth = 0, key = "width") {
	const width = typeof value === "number" ? value : pluckDeep(value, key);
	return width ? `${width}px` : `${defaultWidth}px`;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/components/ContextualSaveBar/ContextualSaveBar.css.js
var styles$22 = {
	"ContextualSaveBar": "Polaris-Frame-ContextualSaveBar",
	"LogoContainer": "Polaris-Frame-ContextualSaveBar__LogoContainer",
	"ContextControl": "Polaris-Frame-ContextualSaveBar__ContextControl",
	"Contents": "Polaris-Frame-ContextualSaveBar__Contents",
	"fullWidth": "Polaris-Frame-ContextualSaveBar--fullWidth",
	"MessageContainer": "Polaris-Frame-ContextualSaveBar__MessageContainer",
	"ActionContainer": "Polaris-Frame-ContextualSaveBar__ActionContainer",
	"Action": "Polaris-Frame-ContextualSaveBar__Action"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Modal/Modal.css.js
var styles$21 = {
	"Body": "Polaris-Modal__Body",
	"NoScrollBody": "Polaris-Modal__NoScrollBody",
	"IFrame": "Polaris-Modal__IFrame"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Modal/components/Section/Section.css.js
var styles$20 = {
	"Section": "Polaris-Modal-Section",
	"titleHidden": "Polaris-Modal-Section--titleHidden"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Modal/components/Section/Section.js
function Section$1({ children, flush = false, subdued = false, titleHidden = false }) {
	const className = classNames(styles$20.Section, titleHidden && styles$20.titleHidden);
	return /* @__PURE__ */ React.createElement("div", { className }, /* @__PURE__ */ React.createElement(Box, Object.assign({
		as: "section",
		padding: flush ? "0" : "400"
	}, titleHidden && { paddingInlineEnd: "0" }, subdued && { background: "bg-surface-tertiary" }), children));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Modal/components/Dialog/Dialog.css.js
var styles$19 = {
	"Container": "Polaris-Modal-Dialog__Container",
	"Dialog": "Polaris-Modal-Dialog",
	"Modal": "Polaris-Modal-Dialog__Modal",
	"limitHeight": "Polaris-Modal-Dialog--limitHeight",
	"sizeSmall": "Polaris-Modal-Dialog--sizeSmall",
	"sizeLarge": "Polaris-Modal-Dialog--sizeLarge",
	"sizeFullScreen": "Polaris-Modal-Dialog--sizeFullScreen",
	"animateFadeUp": "Polaris-Modal-Dialog--animateFadeUp",
	"entering": "Polaris-Modal-Dialog--entering",
	"exiting": "Polaris-Modal-Dialog--exiting",
	"exited": "Polaris-Modal-Dialog--exited",
	"entered": "Polaris-Modal-Dialog--entered"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/focus-manager/hooks.js
function useFocusManager({ trapping }) {
	const focusManager = useContext(FocusManagerContext);
	const id = useId();
	if (!focusManager) throw new MissingAppProviderError("No FocusManager was provided.");
	const { trapFocusList, add: addFocusItem, remove: removeFocusItem } = focusManager;
	const canSafelyFocus = trapFocusList[0] === id;
	const value = useMemo(() => ({ canSafelyFocus }), [canSafelyFocus]);
	useEffect(() => {
		if (!trapping) return;
		addFocusItem(id);
		return () => {
			removeFocusItem(id);
		};
	}, [
		addFocusItem,
		id,
		removeFocusItem,
		trapping
	]);
	return value;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/TrapFocus/TrapFocus.js
function TrapFocus({ trapping = true, children }) {
	const { canSafelyFocus } = useFocusManager({ trapping });
	const focusTrapWrapper = useRef(null);
	const [disableFocus, setDisableFocus] = useState(true);
	useEffect(() => {
		setDisableFocus(canSafelyFocus && !(focusTrapWrapper.current && focusTrapWrapper.current.contains(document.activeElement)) ? !trapping : true);
	}, [canSafelyFocus, trapping]);
	const handleFocusIn = (event) => {
		const containerContentsHaveFocus = focusTrapWrapper.current && focusTrapWrapper.current.contains(document.activeElement);
		if (trapping === false || !focusTrapWrapper.current || containerContentsHaveFocus || event.target instanceof Element && event.target.matches(`${portal.selector} *`)) return;
		if (canSafelyFocus && event.target instanceof HTMLElement && focusTrapWrapper.current !== event.target && !focusTrapWrapper.current.contains(event.target)) focusFirstFocusableNode(focusTrapWrapper.current);
	};
	const handleTab = (event) => {
		if (trapping === false || !focusTrapWrapper.current) return;
		const firstFocusableNode = findFirstKeyboardFocusableNode(focusTrapWrapper.current);
		const lastFocusableNode = findLastKeyboardFocusableNode(focusTrapWrapper.current);
		if (event.target === lastFocusableNode && !event.shiftKey) {
			event.preventDefault();
			focusFirstKeyboardFocusableNode(focusTrapWrapper.current);
		}
		if (event.target === firstFocusableNode && event.shiftKey) {
			event.preventDefault();
			focusLastKeyboardFocusableNode(focusTrapWrapper.current);
		}
	};
	return /* @__PURE__ */ React.createElement(Focus, {
		disabled: disableFocus,
		root: focusTrapWrapper.current
	}, /* @__PURE__ */ React.createElement("div", { ref: focusTrapWrapper }, /* @__PURE__ */ React.createElement(EventListener, {
		event: "focusin",
		handler: handleFocusIn
	}), /* @__PURE__ */ React.createElement(KeypressListener, {
		keyCode: Key.Tab,
		keyEvent: "keydown",
		handler: handleTab
	}), children));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Modal/components/Dialog/Dialog.js
function Dialog({ instant, labelledBy, children, limitHeight, size, onClose, onExited, onEntered, setClosing, hasToasts, ...props }) {
	const theme = useTheme();
	const containerNode = useRef(null);
	const frameContext = useContext(FrameContext);
	let toastMessages;
	if (frameContext) toastMessages = frameContext.toastMessages;
	const classes = classNames(styles$19.Modal, size && styles$19[variationName("size", size)], limitHeight && styles$19.limitHeight);
	const TransitionChild = instant ? Transition : FadeUp;
	useEffect(() => {
		containerNode.current && !containerNode.current.contains(document.activeElement) && focusFirstFocusableNode(containerNode.current);
	}, []);
	const handleKeyDown = () => {
		if (setClosing) setClosing(true);
	};
	const handleKeyUp = () => {
		if (setClosing) setClosing(false);
		onClose();
	};
	const ariaLiveAnnouncements = /* @__PURE__ */ React.createElement("div", { "aria-live": "assertive" }, toastMessages ? toastMessages.map((toastMessage) => /* @__PURE__ */ React.createElement(Text, {
		visuallyHidden: true,
		as: "p",
		key: toastMessage.id
	}, toastMessage.content)) : null);
	return /* @__PURE__ */ React.createElement(TransitionChild, Object.assign({}, props, {
		nodeRef: containerNode,
		mountOnEnter: true,
		unmountOnExit: true,
		timeout: parseInt(theme.motion["motion-duration-200"], 10),
		onEntered,
		onExited
	}), /* @__PURE__ */ React.createElement("div", {
		className: styles$19.Container,
		"data-polaris-layer": true,
		"data-polaris-overlay": true,
		ref: containerNode
	}, /* @__PURE__ */ React.createElement(TrapFocus, null, /* @__PURE__ */ React.createElement("div", {
		role: "dialog",
		"aria-modal": true,
		"aria-label": labelledBy,
		"aria-labelledby": labelledBy,
		tabIndex: -1,
		className: styles$19.Dialog
	}, /* @__PURE__ */ React.createElement("div", { className: classes }, /* @__PURE__ */ React.createElement(KeypressListener, {
		keyCode: Key.Escape,
		keyEvent: "keydown",
		handler: handleKeyDown
	}), /* @__PURE__ */ React.createElement(KeypressListener, {
		keyCode: Key.Escape,
		handler: handleKeyUp
	}), children), ariaLiveAnnouncements))));
}
var fadeUpClasses = {
	appear: classNames(styles$19.animateFadeUp, styles$19.entering),
	appearActive: classNames(styles$19.animateFadeUp, styles$19.entered),
	enter: classNames(styles$19.animateFadeUp, styles$19.entering),
	enterActive: classNames(styles$19.animateFadeUp, styles$19.entered),
	exit: classNames(styles$19.animateFadeUp, styles$19.exiting),
	exitActive: classNames(styles$19.animateFadeUp, styles$19.exited)
};
function FadeUp({ children, ...props }) {
	return /* @__PURE__ */ React.createElement(CSSTransition, Object.assign({}, props, { classNames: fadeUpClasses }), children);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Modal/components/CloseButton/CloseButton.js
function CloseButton({ pressed, onClick }) {
	const i18n = useI18n();
	return /* @__PURE__ */ React.createElement(Button, {
		variant: "tertiary",
		pressed,
		icon: SvgXIcon,
		onClick,
		accessibilityLabel: i18n.translate("Polaris.Common.close")
	});
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Modal/components/Header/Header.js
function Header$1({ id, children, closing, titleHidden, onClose }) {
	const headerPaddingInline = "400";
	const headerPaddingBlock = "400";
	if (titleHidden || !children) return /* @__PURE__ */ React.createElement(Box, {
		position: "absolute",
		insetInlineEnd: headerPaddingInline,
		insetBlockStart: headerPaddingBlock,
		zIndex: "1"
	}, /* @__PURE__ */ React.createElement(CloseButton, { onClick: onClose }));
	return /* @__PURE__ */ React.createElement(Box, {
		paddingBlockStart: "400",
		paddingBlockEnd: "400",
		paddingInlineStart: headerPaddingInline,
		paddingInlineEnd: headerPaddingInline,
		borderBlockEndWidth: "025",
		borderColor: "border",
		background: "bg-surface-tertiary"
	}, /* @__PURE__ */ React.createElement(InlineGrid, {
		columns: { xs: "1fr auto" },
		gap: "400"
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "400",
		blockAlign: "center"
	}, /* @__PURE__ */ React.createElement(Text, {
		id,
		as: "h2",
		variant: "headingMd",
		breakWord: true
	}, children)), /* @__PURE__ */ React.createElement(CloseButton, {
		pressed: closing,
		onClick: onClose
	})));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Modal/components/Footer/Footer.js
function Footer({ primaryAction, secondaryActions, children }) {
	const primaryActionButton = primaryAction && buttonsFrom(primaryAction, { variant: "primary" }) || null;
	const secondaryActionButtons = secondaryActions && buttonsFrom(secondaryActions) || null;
	const actions = primaryActionButton || secondaryActionButtons ? /* @__PURE__ */ React.createElement(InlineStack, { gap: "200" }, secondaryActionButtons, primaryActionButton) : null;
	return /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "400",
		blockAlign: "center"
	}, /* @__PURE__ */ React.createElement(Box, {
		borderColor: "border",
		borderBlockStartWidth: "025",
		padding: "400",
		width: "100%"
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "400",
		blockAlign: "center",
		align: "space-between"
	}, /* @__PURE__ */ React.createElement(Box, null, children), actions)));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Modal/Modal.js
var IFRAME_LOADING_HEIGHT = 200;
var DEFAULT_IFRAME_CONTENT_HEIGHT = 400;
var Modal = function Modal({ children, title, titleHidden = false, src, iFrameName, open, instant, sectioned, loading, size, limitHeight, footer, primaryAction, secondaryActions, onScrolledToBottom, activator, activatorWrapper = "div", onClose, onIFrameLoad, onTransitionEnd, noScroll }) {
	const [iframeHeight, setIframeHeight] = useState(IFRAME_LOADING_HEIGHT);
	const [closing, setClosing] = useState(false);
	const headerId = useId();
	const activatorRef = useRef(null);
	const iframeTitle = useI18n().translate("Polaris.Modal.iFrameTitle");
	let dialog;
	let backdrop;
	const handleEntered = useCallback(() => {
		if (onTransitionEnd) onTransitionEnd();
	}, [onTransitionEnd]);
	const handleExited = useCallback(() => {
		setIframeHeight(IFRAME_LOADING_HEIGHT);
		const activatorElement = activator && isRef(activator) ? activator && activator.current : activatorRef.current;
		if (activatorElement) requestAnimationFrame(() => focusFirstFocusableNode(activatorElement));
	}, [activator]);
	const handleIFrameLoad = useCallback((evt) => {
		const iframe = evt.target;
		if (iframe && iframe.contentWindow) try {
			setIframeHeight(iframe.contentWindow.document.body.scrollHeight);
		} catch (_error) {
			setIframeHeight(DEFAULT_IFRAME_CONTENT_HEIGHT);
		}
		if (onIFrameLoad != null) onIFrameLoad(evt);
	}, [onIFrameLoad]);
	if (open) {
		const footerMarkup = !footer && !primaryAction && !secondaryActions ? null : /* @__PURE__ */ React.createElement(Footer, {
			primaryAction,
			secondaryActions
		}, footer);
		const content = sectioned ? wrapWithComponent(children, Section$1, { titleHidden }) : children;
		const body = loading ? /* @__PURE__ */ React.createElement(Box, { padding: "400" }, /* @__PURE__ */ React.createElement(InlineStack, {
			gap: "400",
			align: "center",
			blockAlign: "center"
		}, /* @__PURE__ */ React.createElement(Spinner$1, null))) : content;
		const scrollContainerMarkup = noScroll ? /* @__PURE__ */ React.createElement("div", { className: styles$21.NoScrollBody }, /* @__PURE__ */ React.createElement(Box, {
			width: "100%",
			overflowX: "hidden",
			overflowY: "hidden"
		}, body)) : /* @__PURE__ */ React.createElement(Scrollable, {
			shadow: true,
			className: styles$21.Body,
			onScrolledToBottom
		}, body);
		const bodyMarkup = src ? /* @__PURE__ */ React.createElement("iframe", {
			name: iFrameName,
			title: iframeTitle,
			src,
			className: styles$21.IFrame,
			onLoad: handleIFrameLoad,
			style: { height: `${iframeHeight}px` }
		}) : scrollContainerMarkup;
		dialog = /* @__PURE__ */ React.createElement(Dialog, {
			instant,
			labelledBy: headerId,
			onClose,
			onEntered: handleEntered,
			onExited: handleExited,
			size,
			limitHeight,
			setClosing
		}, /* @__PURE__ */ React.createElement(Header$1, {
			titleHidden,
			id: headerId,
			closing,
			onClose
		}, title), bodyMarkup, footerMarkup);
		backdrop = /* @__PURE__ */ React.createElement(Backdrop, {
			setClosing,
			onClick: onClose
		});
	}
	const animated = !instant;
	const activatorMarkup = activator && !isRef(activator) ? /* @__PURE__ */ React.createElement(Box, {
		ref: activatorRef,
		as: activatorWrapper
	}, activator) : null;
	return /* @__PURE__ */ React.createElement(WithinContentContext.Provider, { value: true }, activatorMarkup, /* @__PURE__ */ React.createElement(Portal, { idPrefix: "modal" }, /* @__PURE__ */ React.createElement(TransitionGroup, {
		appear: animated,
		enter: animated,
		exit: animated
	}, dialog), backdrop));
};
function isRef(ref) {
	return Object.prototype.hasOwnProperty.call(ref, "current");
}
Modal.Section = Section$1;
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/components/ContextualSaveBar/components/DiscardConfirmationModal/DiscardConfirmationModal.js
function DiscardConfirmationModal({ open, onDiscard, onCancel }) {
	const i18n = useI18n();
	return /* @__PURE__ */ React.createElement(Modal, {
		title: i18n.translate("Polaris.DiscardConfirmationModal.title"),
		open,
		onClose: onCancel,
		primaryAction: {
			content: i18n.translate("Polaris.DiscardConfirmationModal.primaryAction"),
			destructive: true,
			onAction: onDiscard
		},
		secondaryActions: [{
			content: i18n.translate("Polaris.DiscardConfirmationModal.secondaryAction"),
			onAction: onCancel
		}],
		sectioned: true
	}, i18n.translate("Polaris.DiscardConfirmationModal.message"));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/components/ContextualSaveBar/ContextualSaveBar.js
function ContextualSaveBar({ alignContentFlush, message, saveAction, discardAction, fullWidth, contextControl, secondaryMenu }) {
	const i18n = useI18n();
	const { logo } = useFrame();
	const { value: discardConfirmationModalVisible, toggle: toggleDiscardConfirmationModal, setFalse: closeDiscardConfirmationModal } = useToggle(false);
	const handleDiscardAction = useCallback(() => {
		if (discardAction && discardAction.onAction) discardAction.onAction();
		closeDiscardConfirmationModal();
	}, [closeDiscardConfirmationModal, discardAction]);
	const discardActionContent = discardAction && discardAction.content ? discardAction.content : i18n.translate("Polaris.ContextualSaveBar.discard");
	let discardActionHandler;
	if (discardAction && discardAction.discardConfirmationModal) discardActionHandler = toggleDiscardConfirmationModal;
	else if (discardAction) discardActionHandler = discardAction.onAction;
	const discardConfirmationModalMarkup = discardAction && discardAction.onAction && discardAction.discardConfirmationModal && /* @__PURE__ */ React.createElement(DiscardConfirmationModal, {
		open: discardConfirmationModalVisible,
		onCancel: toggleDiscardConfirmationModal,
		onDiscard: handleDiscardAction
	});
	const discardActionMarkup = discardAction && /* @__PURE__ */ React.createElement(Button, {
		variant: "tertiary",
		size: "large",
		url: discardAction.url,
		onClick: discardActionHandler,
		loading: discardAction.loading,
		disabled: discardAction.disabled,
		accessibilityLabel: discardAction.content
	}, discardActionContent);
	const saveActionContent = saveAction && saveAction.content ? saveAction.content : i18n.translate("Polaris.ContextualSaveBar.save");
	const saveActionMarkup = saveAction && /* @__PURE__ */ React.createElement(Button, {
		variant: "primary",
		tone: "success",
		size: "large",
		url: saveAction.url,
		onClick: saveAction.onAction,
		loading: saveAction.loading,
		disabled: saveAction.disabled,
		accessibilityLabel: saveAction.content
	}, saveActionContent);
	const width = getWidth(logo, 104);
	const imageMarkup = logo && /* @__PURE__ */ React.createElement(Image, {
		style: { width },
		source: logo.contextualSaveBarSource || "",
		alt: ""
	});
	const logoMarkup = alignContentFlush || contextControl ? null : /* @__PURE__ */ React.createElement("div", {
		className: styles$22.LogoContainer,
		style: { width }
	}, imageMarkup);
	const contextControlMarkup = contextControl ? /* @__PURE__ */ React.createElement("div", { className: styles$22.ContextControl }, contextControl) : null;
	const contentsClassName = classNames(styles$22.Contents, fullWidth && styles$22.fullWidth);
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: styles$22.ContextualSaveBar }, contextControlMarkup, logoMarkup, /* @__PURE__ */ React.createElement("div", { className: contentsClassName }, /* @__PURE__ */ React.createElement("div", { className: styles$22.MessageContainer }, /* @__PURE__ */ React.createElement(Icon, { source: SvgAlertTriangleIcon }), message && /* @__PURE__ */ React.createElement(Text, {
		as: "h2",
		variant: "headingMd",
		tone: "text-inverse",
		truncate: true
	}, message)), /* @__PURE__ */ React.createElement("div", { className: styles$22.ActionContainer }, /* @__PURE__ */ React.createElement(LegacyStack, {
		spacing: "tight",
		wrap: false
	}, secondaryMenu, discardActionMarkup, saveActionMarkup)))), discardConfirmationModalMarkup);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-deep-compare-ref.js
/**
* Allows for custom or deep comparison of a dependency list. Useful to keep a consistent dependency
* list across reference changes.
* @param dependencies A dependency array similar to React's useEffect / useCallback / useMemo
* @param comparator An optional function to compare dependencies that'll default to a deep comparison
* @returns A dependency list
* @see {@link https://github.com/Shopify/polaris-react/blob/main/src/utilities/use-deep-effect.tsx}
* @see {@link https://github.com/Shopify/polaris-react/blob/main/src/utilities/use-deep-callback.tsx}
* @example
* function useDeepEffectExample(callback, dependencies, customCompare) {
*  useEffect(callback, useDeepCompareRef(dependencies, customCompare));
* }
*/
function useDeepCompareRef(dependencies, comparator = isEqual) {
	const dependencyList = useRef(dependencies);
	if (!comparator(dependencyList.current, dependencies)) dependencyList.current = dependencies;
	return dependencyList.current;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-deep-effect.js
/**
* A replacement for React's useEffect that'll allow for custom and deep
* compares of the dependency list.
* @see {@link https://reactjs.org/docs/hooks-reference.html#useeffect}
* @param callback Accepts a callback that's forwarded to React's useEffect
* @param dependencies A dependency array similar to React's useEffect however it utilizes a deep compare
* @param customCompare Opportunity to provide a custom compare function
* @example
* function ComponentExample() {
*  const [, forceUpdate] = useState();
*  const obj = {a: 1};
*
*  useDeepEffect(() => {
*    console.log('useDeepEffect invocation');
*    forceUpdate(obj);
*  }, [obj]);
*
*  return null;
* }
*/
function useDeepEffect(callback, dependencies, customCompare) {
	useEffect(callback, useDeepCompareRef(dependencies, customCompare));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-deep-callback.js
/**
* A replacement for React's useCallback that'll allow for custom and deep compares.
* @see {@link https://reactjs.org/docs/hooks-reference.html#usecallback}
* @param callback Accepts a callback that's forwarded to React's useCallback
* @param dependencies A dependency array similar to React's useCallback however it utilizes a deep compare
* @param customCompare Opportunity to provide a custom compare function
* @returns A memoized callback
* @example
* const Child = memo(function Child({onClick}) {
*   console.log('Child has rendered.');
*   return <button onClick={onClick}>Click me</button>;
* });
*
* function ComponentExample() {
*   const [timesClicked, setTimesClicked] = useState(0);
*
*   const handleClick = useDeepCallback(() => {
*     setTimesClicked((timesClicked) => timesClicked + 1);
*     // New reference every render
*   }, [{}]);
*
*   return (
*     <>
*       <div>Times clicked: {timesClicked}</div>
*       <Child onClick={handleClick} />
*     </>
*   );
* }
*/
function useDeepCallback(callback, dependencies, customCompare) {
	return useCallback(callback, useDeepCompareRef(dependencies, customCompare));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/components/ToastManager/ToastManager.css.js
var styles$18 = {
	"ToastManager": "Polaris-Frame-ToastManager",
	"ToastWrapper": "Polaris-Frame-ToastManager__ToastWrapper",
	"ToastWrapper-enter": "Polaris-Frame-ToastManager__ToastWrapper--enter",
	"ToastWrapper-exit": "Polaris-Frame-ToastManager__ToastWrapper--exit",
	"ToastWrapper-enter-done": "Polaris-Frame-ToastManager--toastWrapperEnterDone",
	"ToastWrapper--hoverable": "Polaris-Frame-ToastManager--toastWrapperHoverable"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/components/Toast/Toast.css.js
var styles$17 = {
	"Toast": "Polaris-Frame-Toast",
	"Action": "Polaris-Frame-Toast__Action",
	"error": "Polaris-Frame-Toast--error",
	"CloseButton": "Polaris-Frame-Toast__CloseButton",
	"LeadingIcon": "Polaris-Frame-Toast__LeadingIcon",
	"toneMagic": "Polaris-Frame-Toast--toneMagic",
	"WithActionOnComponent": "Polaris-Frame-Toast__WithActionOnComponent"
};
var DEFAULT_TOAST_DURATION_WITH_ACTION = 1e4;
function Toast$1({ content, onDismiss, duration, error, action, tone, onClick, icon, isHovered }) {
	const durationRemaining = useRef(action && !duration ? DEFAULT_TOAST_DURATION_WITH_ACTION : duration || 5e3);
	const timeoutStart = useRef(null);
	const timer = useRef(null);
	useEffect(() => {
		function resume() {
			timeoutStart.current = Date.now();
			timer.current = setTimeout(() => {
				onDismiss();
			}, durationRemaining.current);
		}
		function pause() {
			if (timeoutStart.current) durationRemaining.current -= Date.now() - timeoutStart.current;
			if (timer.current) clearTimeout(timer.current);
			timer.current = null;
		}
		if (isHovered) pause();
		else resume();
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [isHovered, onDismiss]);
	useEffect(() => {
		if (action && duration && duration < 1e4) console.log("Toast with action should persist for at least 10,000 milliseconds to give the merchant enough time to act on it.");
	}, [action, duration]);
	const dismissMarkup = /* @__PURE__ */ React.createElement("button", {
		type: "button",
		className: styles$17.CloseButton,
		onClick: onDismiss
	}, /* @__PURE__ */ React.createElement(Icon, {
		source: SvgXSmallIcon,
		tone: "inherit"
	}));
	const actionMarkup = action ? /* @__PURE__ */ React.createElement("div", { className: styles$17.Action }, /* @__PURE__ */ React.createElement(Button, {
		variant: "monochromePlain",
		removeUnderline: true,
		size: "slim",
		onClick: action.onAction
	}, action.content)) : null;
	let leadingIconMarkup = null;
	if (error) leadingIconMarkup = /* @__PURE__ */ React.createElement("div", { className: styles$17.LeadingIcon }, /* @__PURE__ */ React.createElement(Icon, {
		source: SvgAlertCircleIcon,
		tone: "inherit"
	}));
	else if (icon) leadingIconMarkup = /* @__PURE__ */ React.createElement("div", { className: styles$17.LeadingIcon }, /* @__PURE__ */ React.createElement(Icon, {
		source: icon,
		tone: "inherit"
	}));
	const className = classNames(styles$17.Toast, error && styles$17.error, tone && styles$17[variationName("tone", tone)]);
	if (!action && onClick) return /* @__PURE__ */ React.createElement("button", {
		"aria-live": "assertive",
		className: classNames(className, styles$17.WithActionOnComponent),
		type: "button",
		onClick
	}, /* @__PURE__ */ React.createElement(KeypressListener, {
		keyCode: Key.Escape,
		handler: onDismiss
	}), leadingIconMarkup, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "400",
		blockAlign: "center"
	}, /* @__PURE__ */ React.createElement(Text, Object.assign({
		as: "span",
		variant: "bodyMd",
		fontWeight: "medium"
	}, tone === "magic" && { tone: "magic" }), content)));
	return /* @__PURE__ */ React.createElement("div", {
		className,
		"aria-live": "assertive"
	}, /* @__PURE__ */ React.createElement(KeypressListener, {
		keyCode: Key.Escape,
		handler: onDismiss
	}), leadingIconMarkup, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "400",
		blockAlign: "center"
	}, /* @__PURE__ */ React.createElement(Text, Object.assign({
		as: "span",
		variant: "bodyMd",
		fontWeight: "medium"
	}, tone === "magic" && { tone: "magic" }), content)), actionMarkup, dismissMarkup);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/components/ToastManager/ToastManager.js
var ADDITIONAL_TOAST_BASE_MOVEMENT = 10;
var TOAST_TRANSITION_DELAY = 30;
/**
* Will calculate the vertical movement of the toast based on the index of the sequence. As toasts get further back
* in the view, we want them to not move as much, to give the perception of perspective. This sequence will match this:
* v(0) = 0
* v(1) = 0
* v(2) = 1 (increase of 1)
* v(3) = 3 (increase of 2)
* v(4) = 6 (increase of 3)
* v(5) = 10 (increase of 4)
* and so on...
*
* @param index The index of the sequence
* @returns How many pixels we want to move the toast
*/
function generateAdditionalVerticalMovement(index) {
	const getAmountToRemove = (idx) => (idx - 1) * idx / 2;
	return index * ADDITIONAL_TOAST_BASE_MOVEMENT - getAmountToRemove(index);
}
var ToastManager = /* @__PURE__ */ memo(function ToastManager({ toastMessages }) {
	const toastNodes = [];
	const [shouldExpand, setShouldExpand] = useState(false);
	const isFullyExpanded = useRef(false);
	const fullyExpandedTimeout = useRef(null);
	const firstToast = useRef(null);
	const updateToasts = useDeepCallback(() => {
		const zeroIndexTotalMessages = toastMessages.length - 1;
		toastMessages.forEach((_, index) => {
			const reversedOrder = zeroIndexTotalMessages - index;
			const currentToast = toastNodes[index];
			if (!currentToast.current) return;
			const toastHeight = currentToast.current.clientHeight;
			const scale = shouldExpand ? 1 : .9 ** reversedOrder;
			const additionalVerticalMovement = generateAdditionalVerticalMovement(reversedOrder);
			const targetInPos = shouldExpand ? toastHeight + (toastHeight - 8) * reversedOrder : toastHeight + additionalVerticalMovement;
			currentToast.current.style.setProperty("--pc-toast-manager-translate-y-in", `-${targetInPos}px`);
			currentToast.current.style.setProperty("--pc-toast-manager-scale-in", `${scale}`);
			currentToast.current.style.setProperty("--pc-toast-manager-blur-in", shouldExpand ? "0" : `${reversedOrder * .5}px`);
			currentToast.current.style.setProperty("--pc-toast-manager-transition-delay-in", `${shouldExpand ? reversedOrder * TOAST_TRANSITION_DELAY : 0}ms`);
			currentToast.current.style.setProperty("--pc-toast-manager-scale-out", `${reversedOrder === 0 ? .85 : scale ** 2}`);
			currentToast.current.style.setProperty("--pc-toast-manager-translate-y-out", `${-targetInPos}px`);
		});
	}, [
		toastMessages,
		toastNodes,
		shouldExpand
	]);
	useDeepEffect(() => {
		updateToasts();
		if (toastMessages.length === 0) setShouldExpand(false);
		if (shouldExpand) fullyExpandedTimeout.current = setTimeout(() => {
			isFullyExpanded.current = true;
		}, toastMessages.length * TOAST_TRANSITION_DELAY + 400);
		else if (fullyExpandedTimeout.current) {
			clearTimeout(fullyExpandedTimeout.current);
			isFullyExpanded.current = false;
		}
	}, [toastMessages, shouldExpand]);
	const toastsMarkup = toastMessages.map((toast, index) => {
		const reverseOrderIndex = toastMessages.length - index - 1;
		const toastNode = /* @__PURE__ */ createRef();
		toastNodes[index] = toastNode;
		function handleMouseEnter() {
			setShouldExpand(true);
		}
		function handleMouseEnterFirstToast() {
			if (isFullyExpanded.current) setShouldExpand(false);
		}
		return /* @__PURE__ */ React.createElement(CSSTransition, {
			nodeRef: toastNodes[index],
			key: toast.id,
			timeout: {
				enter: 0,
				exit: 200
			},
			classNames: toastClasses
		}, /* @__PURE__ */ React.createElement("div", {
			ref: toastNode,
			onMouseEnter: reverseOrderIndex > 0 ? handleMouseEnter : handleMouseEnterFirstToast
		}, /* @__PURE__ */ React.createElement("div", { ref: (node) => reverseOrderIndex === 0 ? firstToast.current = node : null }, /* @__PURE__ */ React.createElement(Toast$1, Object.assign({}, toast, { isHovered: shouldExpand })))));
	});
	return /* @__PURE__ */ React.createElement(Portal, { idPrefix: "toast" }, /* @__PURE__ */ React.createElement(EventListener, {
		event: "resize",
		handler: updateToasts
	}), /* @__PURE__ */ React.createElement("div", {
		className: styles$18.ToastManager,
		"aria-live": "assertive",
		onMouseEnter: function(event) {
			const target = event.target;
			const isInFirstToast = firstToast.current?.contains(target);
			setShouldExpand(!isInFirstToast);
		},
		onMouseLeave: function() {
			setShouldExpand(false);
		}
	}, /* @__PURE__ */ React.createElement(TransitionGroup, { component: null }, toastsMarkup)));
});
var toastClasses = {
	enter: classNames(styles$18.ToastWrapper, styles$18["ToastWrapper-enter"]),
	enterDone: classNames(styles$18.ToastWrapper, styles$18["ToastWrapper-enter-done"]),
	exit: classNames(styles$18.ToastWrapper, styles$18["ToastWrapper-exit"])
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Frame/Frame.js
var APP_FRAME_MAIN = "AppFrameMain";
var APP_FRAME_NAV = "AppFrameNav";
var APP_FRAME_TOP_BAR = "AppFrameTopBar";
var APP_FRAME_LOADING_BAR = "AppFrameLoadingBar";
var FrameInner = class extends PureComponent {
	constructor(...args) {
		super(...args);
		this.state = {
			skipFocused: false,
			globalRibbonHeight: 0,
			loadingStack: 0,
			toastMessages: [],
			showContextualSaveBar: false,
			scrollbarAlwaysVisible: false
		};
		this.contextualSaveBar = null;
		this.globalRibbonContainer = null;
		this.navigationNode = /* @__PURE__ */ createRef();
		this.setGlobalRibbonHeight = () => {
			const { globalRibbonContainer } = this;
			if (globalRibbonContainer) this.setState({ globalRibbonHeight: globalRibbonContainer.offsetHeight }, this.setGlobalRibbonRootProperty);
		};
		this.setOffset = () => {
			const { offset = "0px" } = this.props;
			setRootProperty("--pc-frame-offset", offset);
		};
		this.setScrollbarAlwaysVisible = () => {
			const scrollbarWidth = parseInt(document.documentElement.style.getPropertyValue("--pc-app-provider-scrollbar-width"), 10);
			this.setState({ scrollbarAlwaysVisible: scrollbarWidth > 0 });
		};
		this.setGlobalRibbonRootProperty = () => {
			const { globalRibbonHeight } = this.state;
			setRootProperty("--pc-frame-global-ribbon-height", `${globalRibbonHeight}px`);
		};
		this.showToast = (toast) => {
			this.setState(({ toastMessages }) => {
				return { toastMessages: toastMessages.find(({ id }) => id === toast.id) != null ? toastMessages : [...toastMessages, toast] };
			});
		};
		this.hideToast = ({ id }) => {
			this.setState(({ toastMessages }) => {
				return { toastMessages: toastMessages.filter(({ id: toastId }) => id !== toastId) };
			});
		};
		this.setContextualSaveBar = (props) => {
			const { showContextualSaveBar } = this.state;
			this.contextualSaveBar = { ...props };
			if (showContextualSaveBar === true) this.forceUpdate();
			else this.setState({ showContextualSaveBar: true });
		};
		this.removeContextualSaveBar = () => {
			this.contextualSaveBar = null;
			this.setState({ showContextualSaveBar: false });
		};
		this.startLoading = () => {
			this.setState(({ loadingStack }) => ({ loadingStack: loadingStack + 1 }));
		};
		this.stopLoading = () => {
			this.setState(({ loadingStack }) => ({ loadingStack: Math.max(0, loadingStack - 1) }));
		};
		this.handleResize = () => {
			if (this.props.globalRibbon) this.setGlobalRibbonHeight();
		};
		this.handleFocus = () => {
			this.setState({ skipFocused: true });
		};
		this.handleBlur = () => {
			this.setState({ skipFocused: false });
		};
		this.handleClick = (event) => {
			const { skipToContentTarget } = this.props;
			if (skipToContentTarget && skipToContentTarget.current) {
				skipToContentTarget.current.focus();
				event?.preventDefault();
			}
		};
		this.handleNavigationDismiss = () => {
			const { onNavigationDismiss } = this.props;
			if (onNavigationDismiss != null) onNavigationDismiss();
		};
		this.setGlobalRibbonContainer = (node) => {
			this.globalRibbonContainer = node;
		};
		this.handleNavKeydown = (event) => {
			const { key } = event;
			const { mediaQuery: { isNavigationCollapsed }, showMobileNavigation } = this.props;
			if (isNavigationCollapsed && showMobileNavigation && key === "Escape") this.handleNavigationDismiss();
		};
	}
	componentDidMount() {
		this.handleResize();
		if (this.props.globalRibbon) return;
		this.setGlobalRibbonRootProperty();
		this.setOffset();
		this.setScrollbarAlwaysVisible();
	}
	componentDidUpdate(prevProps) {
		if (this.props.globalRibbon !== prevProps.globalRibbon) this.setGlobalRibbonHeight();
		this.setOffset();
	}
	render() {
		const { skipFocused, loadingStack, toastMessages, showContextualSaveBar } = this.state;
		const { logo, children, navigation, topBar, globalRibbon, showMobileNavigation = false, skipToContentTarget, i18n, sidebar, mediaQuery: { isNavigationCollapsed } } = this.props;
		const navClassName = classNames(styles$25.Navigation, showMobileNavigation && styles$25["Navigation-visible"]);
		const mobileNavHidden = isNavigationCollapsed && !showMobileNavigation;
		const mobileNavShowing = isNavigationCollapsed && showMobileNavigation;
		const tabIndex = mobileNavShowing ? 0 : -1;
		const mobileNavAttributes = { ...mobileNavShowing && {
			"aria-modal": true,
			role: "dialog"
		} };
		const navigationMarkup = navigation ? /* @__PURE__ */ React.createElement(UseTheme, null, (theme) => /* @__PURE__ */ React.createElement(TrapFocus, { trapping: mobileNavShowing }, /* @__PURE__ */ React.createElement(CSSTransition, {
			nodeRef: this.navigationNode,
			appear: isNavigationCollapsed,
			exit: isNavigationCollapsed,
			in: showMobileNavigation,
			timeout: parseInt(theme.motion["motion-duration-300"], 10),
			classNames: navTransitionClasses
		}, /* @__PURE__ */ React.createElement("div", Object.assign({ key: "NavContent" }, mobileNavAttributes, {
			"aria-label": i18n.translate("Polaris.Frame.navigationLabel"),
			ref: this.navigationNode,
			className: navClassName,
			onKeyDown: this.handleNavKeydown,
			id: APP_FRAME_NAV,
			hidden: mobileNavHidden
		}), navigation, /* @__PURE__ */ React.createElement("button", {
			type: "button",
			className: styles$25.NavigationDismiss,
			onClick: this.handleNavigationDismiss,
			"aria-hidden": mobileNavHidden || !isNavigationCollapsed && !showMobileNavigation,
			"aria-label": i18n.translate("Polaris.Frame.Navigation.closeMobileNavigationLabel"),
			tabIndex
		}, /* @__PURE__ */ React.createElement(Icon, { source: SvgXIcon })))))) : null;
		const loadingMarkup = loadingStack > 0 ? /* @__PURE__ */ React.createElement("div", {
			className: styles$25.LoadingBar,
			id: APP_FRAME_LOADING_BAR
		}, /* @__PURE__ */ React.createElement(Loading, null)) : null;
		const topBarMarkup = topBar ? /* @__PURE__ */ React.createElement("div", Object.assign({ className: styles$25.TopBar }, layer.props, dataPolarisTopBar.props, { id: APP_FRAME_TOP_BAR }), topBar) : null;
		const globalRibbonMarkup = globalRibbon ? /* @__PURE__ */ React.createElement("div", {
			className: styles$25.GlobalRibbonContainer,
			ref: this.setGlobalRibbonContainer
		}, globalRibbon) : null;
		const skipClassName = classNames(styles$25.Skip, skipFocused && styles$25.focused);
		const skipTarget = skipToContentTarget?.current ? skipToContentTarget.current.id : APP_FRAME_MAIN;
		const skipMarkup = /* @__PURE__ */ React.createElement("div", { className: skipClassName }, /* @__PURE__ */ React.createElement("a", {
			href: `#${skipTarget}`,
			onFocus: this.handleFocus,
			onBlur: this.handleBlur,
			onClick: this.handleClick
		}, /* @__PURE__ */ React.createElement(Text, {
			as: "span",
			variant: "bodyLg",
			fontWeight: "medium"
		}, i18n.translate("Polaris.Frame.skipToContent"))));
		const navigationAttributes = navigation ? { "data-has-navigation": true } : {};
		const getFrameClassName = () => classNames(styles$25.Frame, navigation && styles$25.hasNav, topBar && styles$25.hasTopBar, sidebar && styles$25.hasSidebar, this.state.scrollbarAlwaysVisible && styles$25.ScrollbarAlwaysVisible);
		const contextualSaveBarMarkup = /* @__PURE__ */ React.createElement(CSSAnimation, {
			in: showContextualSaveBar,
			className: styles$25.ContextualSaveBar,
			type: "fade"
		}, /* @__PURE__ */ React.createElement(ContextualSaveBar, this.contextualSaveBar));
		const navigationOverlayMarkup = showMobileNavigation && isNavigationCollapsed ? /* @__PURE__ */ React.createElement(Backdrop, {
			belowNavigation: true,
			onClick: this.handleNavigationDismiss,
			onTouchStart: this.handleNavigationDismiss
		}) : null;
		const context = {
			logo,
			showToast: this.showToast,
			hideToast: this.hideToast,
			toastMessages,
			startLoading: this.startLoading,
			stopLoading: this.stopLoading,
			setContextualSaveBar: this.setContextualSaveBar,
			removeContextualSaveBar: this.removeContextualSaveBar,
			contextualSaveBarVisible: this.state.showContextualSaveBar,
			contextualSaveBarProps: this.contextualSaveBar
		};
		return /* @__PURE__ */ React.createElement(FrameContext.Provider, { value: context }, /* @__PURE__ */ React.createElement("div", Object.assign({ className: getFrameClassName() }, layer.props, navigationAttributes), skipMarkup, topBarMarkup, navigationMarkup, contextualSaveBarMarkup, loadingMarkup, navigationOverlayMarkup, /* @__PURE__ */ React.createElement("main", {
			className: styles$25.Main,
			id: APP_FRAME_MAIN,
			"data-has-global-ribbon": Boolean(globalRibbon)
		}, /* @__PURE__ */ React.createElement("div", { className: styles$25.Content }, children)), /* @__PURE__ */ React.createElement(ToastManager, { toastMessages }), globalRibbonMarkup, /* @__PURE__ */ React.createElement(EventListener, {
			event: "resize",
			handler: this.handleResize
		})));
	}
};
var navTransitionClasses = {
	enter: classNames(styles$25["Navigation-enter"]),
	enterActive: classNames(styles$25["Navigation-enterActive"]),
	enterDone: classNames(styles$25["Navigation-enterActive"]),
	exit: classNames(styles$25["Navigation-exit"]),
	exitActive: classNames(styles$25["Navigation-exitActive"])
};
function Frame(props) {
	const i18n = useI18n();
	const mediaQuery = useMediaQuery();
	return /* @__PURE__ */ React.createElement(FrameInner, Object.assign({}, props, {
		i18n,
		mediaQuery
	}));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/types.js
var IndexFiltersMode = /* @__PURE__ */ function(IndexFiltersMode) {
	IndexFiltersMode["Default"] = "DEFAULT";
	IndexFiltersMode["Filtering"] = "FILTERING";
	IndexFiltersMode["EditingColumns"] = "EDITING_COLUMNS";
	return IndexFiltersMode;
}({});
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/IndexFilters.css.js
var styles$16 = {
	"IndexFiltersWrapper": "Polaris-IndexFilters__IndexFiltersWrapper",
	"IndexFilters": "Polaris-IndexFilters",
	"IndexFiltersSticky": "Polaris-IndexFilters__IndexFiltersSticky",
	"IndexFiltersStickyFlush": "Polaris-IndexFilters__IndexFiltersStickyFlush",
	"TabsWrapper": "Polaris-IndexFilters__TabsWrapper",
	"SmallScreenTabsWrapper": "Polaris-IndexFilters__SmallScreenTabsWrapper",
	"TabsWrapperLoading": "Polaris-IndexFilters__TabsWrapperLoading",
	"DesktopLoading": "Polaris-IndexFilters__DesktopLoading",
	"TabsLoading": "Polaris-IndexFilters__TabsLoading",
	"ActionWrap": "Polaris-IndexFilters__ActionWrap",
	"Spinner": "Polaris-IndexFilters__Spinner",
	"ButtonWrap": "Polaris-IndexFilters__ButtonWrap"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/hooks/useIsSticky/useIsSticky.js
var DEBOUNCE_PERIOD = 250;
function useIsSticky(mode, disabled, isFlushWhenSticky) {
	const hasIOSupport = typeof window !== "undefined" && Boolean(window.IntersectionObserver);
	const options = {
		root: null,
		rootMargin: `${isFlushWhenSticky ? "0px" : "-56px"} 0px 0px 0px`,
		threshold: 0
	};
	const [indexFilteringHeight, setIndexFiltersHeight] = useState(0);
	const [isSticky, setIsSticky] = useState(false);
	const measurerRef = useRef(null);
	const intersectionRef = useRef(null);
	const handleIntersect = (entries) => {
		entries.forEach((entry) => {
			setIsSticky(!entry.isIntersecting);
		});
	};
	const observerRef = useRef(hasIOSupport ? new IntersectionObserver(handleIntersect, options) : null);
	useEffect(() => {
		function computeDimensions() {
			const node = measurerRef.current;
			if (!node) return { height: 0 };
			const height = node.getBoundingClientRect().height;
			setIndexFiltersHeight(height);
		}
		computeDimensions();
		const debouncedComputeDimensions = debounce(computeDimensions, DEBOUNCE_PERIOD, { trailing: true });
		window.addEventListener("resize", debouncedComputeDimensions);
		return () => window.removeEventListener("resize", debouncedComputeDimensions);
	}, [measurerRef, mode]);
	useEffect(() => {
		const observer = observerRef.current;
		if (!observer) return;
		const node = intersectionRef.current;
		if (node) observer.observe(node);
		return () => {
			observer?.disconnect();
		};
	}, [intersectionRef]);
	return {
		intersectionRef,
		measurerRef,
		isSticky: isSticky && !disabled,
		indexFilteringHeight
	};
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-is-touch-device.js
function useIsTouchDevice() {
	const [isTouchDevice, setIsTouchDevice] = useState(false);
	useEventListener("touchstart", useCallback(() => setIsTouchDevice(true), []));
	return isTouchDevice;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/components/UpdateButtons/UpdateButtons.js
var MAX_VIEW_NAME_LENGTH$2 = 40;
function UpdateButtons({ primaryAction, cancelAction, viewNames, disabled }) {
	const i18n = useI18n();
	const [savedViewName, setSavedViewName] = useState("");
	const [savedViewModalOpen, setSavedViewModalOpen] = useState(false);
	const container = useRef(null);
	const isTouchDevice = useIsTouchDevice();
	useEffect(() => {
		if (!container.current || isTouchDevice) return;
		if (savedViewModalOpen) focusFirstFocusableNode(container.current);
	}, [savedViewModalOpen, isTouchDevice]);
	async function handleClickSaveButton() {
		if (primaryAction?.type === "save-as") handleOpenModal();
		else await primaryAction?.onAction("");
	}
	function handleOpenModal() {
		setSavedViewModalOpen(true);
	}
	function handleCloseModal() {
		setSavedViewModalOpen(false);
	}
	function handleChange(value) {
		setSavedViewName(value);
	}
	async function handlePrimaryAction() {
		if (isPrimaryActionDisabled) return;
		await primaryAction?.onAction(savedViewName);
		handleCloseModal();
	}
	const buttonText = useMemo(() => {
		switch (primaryAction?.type) {
			case "save": return i18n.translate("Polaris.IndexFilters.UpdateButtons.save");
			default: return i18n.translate("Polaris.IndexFilters.UpdateButtons.saveAs");
		}
	}, [primaryAction?.type, i18n]);
	const saveButton = /* @__PURE__ */ React.createElement(Button, {
		size: "micro",
		onClick: handleClickSaveButton,
		disabled: primaryAction?.disabled || disabled
	}, buttonText);
	const hasSameNameError = viewNames.some((name) => name.trim().toLowerCase() === savedViewName.trim().toLowerCase());
	const isPrimaryActionDisabled = hasSameNameError || !savedViewName || primaryAction?.loading || savedViewName.length > MAX_VIEW_NAME_LENGTH$2;
	const cancelButtonMarkup = cancelAction ? /* @__PURE__ */ React.createElement(Button, {
		variant: "tertiary",
		size: "micro",
		onClick: cancelAction.onAction,
		disabled
	}, i18n.translate("Polaris.IndexFilters.UpdateButtons.cancel")) : null;
	if (!primaryAction) return cancelButtonMarkup;
	return /* @__PURE__ */ React.createElement(InlineStack, {
		align: "start",
		blockAlign: "center",
		gap: "100"
	}, cancelButtonMarkup, primaryAction.type === "save-as" ? /* @__PURE__ */ React.createElement(Modal, {
		activator: /* @__PURE__ */ React.createElement(InlineStack, null, saveButton),
		open: savedViewModalOpen,
		title: i18n.translate("Polaris.IndexFilters.UpdateButtons.modal.title"),
		onClose: handleCloseModal,
		primaryAction: {
			onAction: handlePrimaryAction,
			content: i18n.translate("Polaris.IndexFilters.UpdateButtons.modal.save"),
			disabled: isPrimaryActionDisabled
		},
		secondaryActions: [{
			onAction: handleCloseModal,
			content: i18n.translate("Polaris.IndexFilters.UpdateButtons.modal.cancel")
		}]
	}, /* @__PURE__ */ React.createElement(Modal.Section, null, /* @__PURE__ */ React.createElement(Form$1, { onSubmit: handlePrimaryAction }, /* @__PURE__ */ React.createElement(FormLayout, null, /* @__PURE__ */ React.createElement("div", { ref: container }, /* @__PURE__ */ React.createElement(TextField, {
		label: i18n.translate("Polaris.IndexFilters.UpdateButtons.modal.label"),
		value: savedViewName,
		onChange: handleChange,
		autoComplete: "off",
		maxLength: MAX_VIEW_NAME_LENGTH$2,
		showCharacterCount: true,
		error: hasSameNameError ? i18n.translate("Polaris.IndexFilters.UpdateButtons.modal.sameName", { name: savedViewName }) : void 0
	})))))) : saveButton);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/components/SortButton/components/DirectionButton/DirectionButton.css.js
var styles$15 = {
	"DirectionButton": "Polaris-SortButton-DirectionButton",
	"DirectionButton-active": "Polaris-SortButton-DirectionButton__DirectionButton--active"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/components/SortButton/components/DirectionButton/DirectionButton.js
function DirectionButton({ onClick, active, children, direction, value }) {
	const classes = classNames(styles$15.DirectionButton, active && styles$15["DirectionButton-active"]);
	function handleClick() {
		onClick([value]);
	}
	return /* @__PURE__ */ React.createElement(UnstyledButton, {
		className: classes,
		onClick: handleClick
	}, /* @__PURE__ */ React.createElement(Icon, {
		source: direction === "asc" ? SvgArrowUpIcon : SvgArrowDownIcon,
		tone: "base"
	}), /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodySm",
		fontWeight: "medium"
	}, children));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/components/SortButton/SortButton.js
var SortButtonDirection = /* @__PURE__ */ function(SortButtonDirection) {
	SortButtonDirection["Asc"] = "asc";
	SortButtonDirection["Desc"] = "desc";
	return SortButtonDirection;
}({});
function SortButton({ choices, selected, disabled, disclosureZIndexOverride, onChange, onChangeKey, onChangeDirection }) {
	const i18n = useI18n();
	const [active, setActive] = useState(false);
	const [selectedValueKey, selectedDirection] = selected[0].split(" ");
	function handleClick() {
		setActive((pastActive) => !pastActive);
	}
	function handleClose() {
		setActive(false);
	}
	function handleChangeChoiceList(sel) {
		if (onChangeKey) {
			const [key] = sel[0].split(" ");
			onChangeKey(key);
		} else onChange(sel);
	}
	function handleChangeDirection(sel) {
		if (onChangeDirection) {
			const [, direction] = sel[0].split(" ");
			onChangeDirection(direction);
		} else onChange(sel);
	}
	const choiceListChoices = useMemo(() => {
		return choices.reduce((acc, curr) => {
			const alreadyExists = acc.some((option) => option.label === curr.label);
			const [, currentValueDirection] = curr.value.split(" ");
			const isSameDirection = currentValueDirection === selectedDirection;
			if (!alreadyExists) return [...acc, curr];
			if (isSameDirection) return acc.map((option) => {
				if (option.label === curr.label) return curr;
				return option;
			});
			return acc;
		}, []);
	}, [choices, selectedDirection]);
	const selectedChoices = choices.filter((choice) => {
		const [currentKey] = choice.value.split(" ");
		return currentKey === selectedValueKey;
	});
	const sortButton = /* @__PURE__ */ React.createElement(Tooltip, {
		content: i18n.translate("Polaris.IndexFilters.SortButton.tooltip"),
		preferredPosition: "above",
		hoverDelay: 400,
		zIndexOverride: disclosureZIndexOverride
	}, /* @__PURE__ */ React.createElement(Button, {
		size: "slim",
		icon: SvgSortIcon,
		onClick: handleClick,
		disabled,
		accessibilityLabel: i18n.translate("Polaris.IndexFilters.SortButton.ariaLabel")
	}));
	return /* @__PURE__ */ React.createElement(Popover, {
		fluidContent: true,
		active: active && !disabled,
		activator: sortButton,
		autofocusTarget: "first-node",
		onClose: handleClose,
		preferredAlignment: "right",
		zIndexOverride: disclosureZIndexOverride
	}, /* @__PURE__ */ React.createElement(Box, {
		minWidth: "148px",
		paddingInlineStart: "300",
		paddingInlineEnd: "300",
		paddingBlockStart: "200",
		paddingBlockEnd: "200",
		borderBlockEndWidth: "025",
		borderColor: "border-secondary"
	}, /* @__PURE__ */ React.createElement(ChoiceList, {
		title: i18n.translate("Polaris.IndexFilters.SortButton.title"),
		choices: choiceListChoices,
		selected,
		onChange: handleChangeChoiceList
	})), /* @__PURE__ */ React.createElement(Box, {
		paddingInlineStart: "150",
		paddingInlineEnd: "150",
		paddingBlockStart: "200",
		paddingBlockEnd: "200"
	}, /* @__PURE__ */ React.createElement(DirectionButton, {
		direction: "asc",
		active: selectedDirection === SortButtonDirection.Asc,
		onClick: handleChangeDirection,
		value: selectedChoices?.[0]?.value
	}, selectedChoices?.[0]?.directionLabel), /* @__PURE__ */ React.createElement(DirectionButton, {
		direction: "desc",
		active: selectedDirection === SortButtonDirection.Desc,
		onClick: handleChangeDirection,
		value: selectedChoices?.[1]?.value
	}, selectedChoices?.[1]?.directionLabel)));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/components/Container/Container.css.js
var styles$14 = { "Container": "Polaris-IndexFilters-Container" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/components/Container/Container.js
var Container = ({ children }) => {
	return /* @__PURE__ */ React.createElement("div", { className: styles$14.Container }, children);
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/use-previous.js
/**
* Returns the previous value of a variable.
*/
function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref.current;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tabs/utilities.js
function getVisibleAndHiddenTabIndices(tabs, selected, disclosureWidth, tabWidths, containerWidth) {
	const sumTabWidths = tabWidths.reduce((sum, width) => sum + width, 0);
	const arrayOfTabIndices = tabs.map((_, index) => {
		return index;
	});
	const visibleTabs = [];
	const hiddenTabs = [];
	if (containerWidth > sumTabWidths) visibleTabs.push(...arrayOfTabIndices);
	else {
		visibleTabs.push(selected);
		let tabListWidth = tabWidths[selected];
		arrayOfTabIndices.forEach((currentTabIndex) => {
			if (currentTabIndex !== selected) {
				const currentTabWidth = tabWidths[currentTabIndex];
				if (tabListWidth + currentTabWidth >= containerWidth - disclosureWidth) {
					hiddenTabs.push(currentTabIndex);
					return;
				}
				visibleTabs.push(currentTabIndex);
				tabListWidth += currentTabWidth;
			}
		});
	}
	return {
		visibleTabs,
		hiddenTabs
	};
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tabs/Tabs.css.js
var styles$13 = {
	"Outer": "Polaris-Tabs__Outer",
	"Wrapper": "Polaris-Tabs__Wrapper",
	"WrapperWithNewButton": "Polaris-Tabs__WrapperWithNewButton",
	"ButtonWrapper": "Polaris-Tabs__ButtonWrapper",
	"Tabs": "Polaris-Tabs",
	"Tab": "Polaris-Tabs__Tab",
	"Tab-active": "Polaris-Tabs__Tab--active",
	"Tab-hasActions": "Polaris-Tabs__Tab--hasActions",
	"Tab-iconOnly": "Polaris-Tabs__Tab--iconOnly",
	"fillSpace": "Polaris-Tabs--fillSpace",
	"TabContainer": "Polaris-Tabs__TabContainer",
	"fitted": "Polaris-Tabs--fitted",
	"titleWithIcon": "Polaris-Tabs--titleWithIcon",
	"List": "Polaris-Tabs__List",
	"Item": "Polaris-Tabs__Item",
	"DisclosureTab": "Polaris-Tabs__DisclosureTab",
	"DisclosureTab-visible": "Polaris-Tabs__DisclosureTab--visible",
	"DisclosureActivator": "Polaris-Tabs__DisclosureActivator",
	"TabsMeasurer": "Polaris-Tabs__TabsMeasurer",
	"NewTab": "Polaris-Tabs__NewTab",
	"ActionListWrap": "Polaris-Tabs__ActionListWrap",
	"Panel": "Polaris-Tabs__Panel",
	"Panel-hidden": "Polaris-Tabs__Panel--hidden"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tabs/components/Tab/components/DuplicateModal/DuplicateModal.js
var MAX_VIEW_NAME_LENGTH$1 = 40;
function DuplicateModal({ open, isModalLoading, name, onClose, onClickPrimaryAction, onClickSecondaryAction, helpText, viewNames }) {
	const i18n = useI18n();
	const [value, setValue] = useState(name);
	const container = useRef(null);
	const hasSameNameError = viewNames?.some((viewName) => viewName.trim().toLowerCase() === value.trim().toLowerCase());
	const isPrimaryActionDisabled = isModalLoading || hasSameNameError || !value || value.length > MAX_VIEW_NAME_LENGTH$1;
	useEffect(() => {
		if (!container.current) return;
		if (open) focusFirstFocusableNode(container.current);
	}, [open]);
	useEffect(() => {
		if (open) setValue(name.slice(0, MAX_VIEW_NAME_LENGTH$1));
	}, [name, open]);
	const handleChange = useCallback((newValue) => {
		setValue(newValue);
	}, []);
	async function handlePrimaryAction() {
		if (isPrimaryActionDisabled) return;
		await onClickPrimaryAction(value);
		setValue("");
		onClose();
	}
	function handleSecondaryAction() {
		onClickSecondaryAction?.();
		setValue(name);
		onClose();
	}
	return /* @__PURE__ */ React.createElement(Modal, {
		open,
		onClose,
		title: i18n.translate("Polaris.Tabs.DuplicateModal.title"),
		primaryAction: {
			content: i18n.translate("Polaris.Tabs.DuplicateModal.create"),
			onAction: handlePrimaryAction,
			disabled: isPrimaryActionDisabled
		},
		secondaryActions: [{
			content: i18n.translate("Polaris.Tabs.DuplicateModal.cancel"),
			onAction: handleSecondaryAction
		}],
		instant: true
	}, /* @__PURE__ */ React.createElement(Modal.Section, null, /* @__PURE__ */ React.createElement(Form$1, { onSubmit: handlePrimaryAction }, /* @__PURE__ */ React.createElement(FormLayout, null, /* @__PURE__ */ React.createElement("div", { ref: container }, /* @__PURE__ */ React.createElement(TextField, {
		label: i18n.translate("Polaris.Tabs.DuplicateModal.label"),
		value,
		onChange: handleChange,
		autoComplete: "off",
		helpText,
		maxLength: MAX_VIEW_NAME_LENGTH$1,
		showCharacterCount: true,
		error: hasSameNameError ? i18n.translate("Polaris.Tabs.DuplicateModal.errors.sameName", { name: value }) : void 0
	}))))));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tabs/components/Tab/components/RenameModal/RenameModal.js
function RenameModal({ open, isModalLoading, name, onClose, onClickPrimaryAction, onClickSecondaryAction, helpText, viewNames }) {
	const i18n = useI18n();
	const [value, setValue] = useState(name);
	const container = useRef(null);
	const hasSameNameError = viewNames?.filter((viewName) => viewName !== name).some((viewName) => viewName.trim().toLowerCase() === value.trim().toLowerCase());
	const isPrimaryActionDisabled = isModalLoading || hasSameNameError || value === name || !value;
	useEffect(() => {
		if (!container.current) return;
		if (open) focusFirstFocusableNode(container.current);
	}, [open]);
	useEffect(() => {
		if (open) setValue(name);
	}, [name, open]);
	const handleChange = useCallback((newValue) => {
		setValue(newValue);
	}, []);
	async function handlePrimaryAction() {
		if (isPrimaryActionDisabled) return;
		await onClickPrimaryAction(value);
		setValue("");
		onClose();
	}
	function handleSecondaryAction() {
		onClickSecondaryAction?.();
		setValue(name);
		onClose();
	}
	return /* @__PURE__ */ React.createElement(Modal, {
		open,
		onClose,
		title: i18n.translate("Polaris.Tabs.RenameModal.title"),
		primaryAction: {
			content: i18n.translate("Polaris.Tabs.RenameModal.create"),
			onAction: handlePrimaryAction,
			disabled: isPrimaryActionDisabled
		},
		secondaryActions: [{
			content: i18n.translate("Polaris.Tabs.RenameModal.cancel"),
			onAction: handleSecondaryAction
		}],
		instant: true
	}, /* @__PURE__ */ React.createElement(Modal.Section, null, /* @__PURE__ */ React.createElement(Form$1, { onSubmit: handlePrimaryAction }, /* @__PURE__ */ React.createElement(FormLayout, null, /* @__PURE__ */ React.createElement("div", { ref: container }, /* @__PURE__ */ React.createElement(TextField, {
		label: i18n.translate("Polaris.Tabs.RenameModal.label"),
		value,
		onChange: handleChange,
		autoComplete: "off",
		helpText,
		maxLength: 40,
		showCharacterCount: true,
		error: hasSameNameError ? i18n.translate("Polaris.Tabs.RenameModal.errors.sameName", { name: value }) : void 0
	}))))));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tabs/components/Tab/Tab.js
var Tab = /* @__PURE__ */ forwardRef(({ content, accessibilityLabel, badge, id, panelID, url, onAction, actions, disabled, isModalLoading, icon, siblingTabHasFocus, measuring, focused, selected, onToggleModal, onTogglePopover, viewNames, tabIndexOverride, disclosureZIndexOverride, onFocus }, ref) => {
	const i18n = useI18n();
	const [popoverActive, setPopoverActive] = useState(false);
	const [activeModalType, setActiveModalType] = useState(null);
	const wasSelected = useRef(selected);
	const panelFocused = useRef(false);
	const node = useRef(null);
	useEffect(() => {
		onTogglePopover(popoverActive);
	}, [popoverActive, onTogglePopover]);
	useEffect(() => {
		onToggleModal(Boolean(activeModalType));
	}, [activeModalType, onToggleModal]);
	useEffect(() => {
		return () => {
			onToggleModal(false);
			onTogglePopover(false);
		};
	}, [onToggleModal, onTogglePopover]);
	useEffect(() => {
		if (measuring) return;
		if ((focused || document.activeElement && document.activeElement.id === id) && selected && panelID != null && !panelFocused.current) {
			focusPanelID(panelID);
			panelFocused.current = true;
		}
		if (selected && !wasSelected.current && panelID != null) focusPanelID(panelID);
		else if (focused && node.current != null && activeModalType == null && !disabled) focusFirstFocusableNode(node.current);
		wasSelected.current = selected;
	}, [
		focused,
		id,
		content,
		measuring,
		panelID,
		selected,
		activeModalType,
		disabled
	]);
	let tabIndex;
	if (selected && !siblingTabHasFocus && !measuring) tabIndex = 0;
	else if (focused && !measuring) tabIndex = 0;
	else tabIndex = -1;
	if (tabIndexOverride != null) tabIndex = tabIndexOverride;
	const renameAction = actions?.find((action) => action.type === "rename");
	const duplicateAction = actions?.find((action) => action.type === "duplicate");
	const deleteAction = actions?.find((action) => action.type === "delete");
	const togglePopoverActive = useCallback(() => {
		if (!actions?.length) return;
		setPopoverActive((popoverActive) => !popoverActive);
	}, [actions]);
	const handleClick = useCallback(() => {
		if (disabled) return;
		if (selected) togglePopoverActive();
		else onAction?.();
	}, [
		selected,
		onAction,
		togglePopoverActive,
		disabled
	]);
	const handleModalOpen = (type) => {
		setActiveModalType(type);
	};
	const handleModalClose = () => {
		setActiveModalType(null);
	};
	const handleSaveRenameModal = useCallback(async (value) => {
		await renameAction?.onPrimaryAction?.(value);
		setTimeout(() => {
			if (node.current) focusFirstFocusableNode(node.current);
		}, 250);
	}, [renameAction]);
	const handleConfirmDeleteView = useCallback(async () => {
		await deleteAction?.onPrimaryAction?.(content);
		handleModalClose();
	}, [deleteAction, content]);
	const handleSaveDuplicateModal = useCallback(async (duplicateName) => {
		await duplicateAction?.onPrimaryAction?.(duplicateName);
	}, [duplicateAction]);
	const actionContent = {
		rename: {
			icon: SvgInfoIcon,
			content: i18n.translate("Polaris.Tabs.Tab.rename")
		},
		duplicate: {
			icon: SvgDuplicateIcon,
			content: i18n.translate("Polaris.Tabs.Tab.duplicate")
		},
		edit: {
			icon: SvgEditIcon,
			content: i18n.translate("Polaris.Tabs.Tab.edit")
		},
		"edit-columns": {
			icon: SvgLayoutColumns3Icon,
			content: i18n.translate("Polaris.Tabs.Tab.editColumns")
		},
		delete: {
			icon: SvgDeleteIcon,
			content: i18n.translate("Polaris.Tabs.Tab.delete"),
			destructive: true
		}
	};
	const formattedActions = actions?.map(({ type, onAction, onPrimaryAction, ...additionalOptions }) => {
		const isModalActivator = !type.includes("edit");
		return {
			...actionContent[type],
			...additionalOptions,
			onAction: () => {
				onAction?.(content);
				togglePopoverActive();
				if (isModalActivator) handleModalOpen(type);
			}
		};
	});
	const handleKeyDown = useCallback((event) => {
		if (event.key === " ") {
			event.preventDefault();
			handleClick();
		}
	}, [handleClick]);
	const tabContainerClassNames = classNames(styles$13.TabContainer, selected && styles$13.Underline);
	const urlIfNotDisabledOrSelected = disabled || selected ? void 0 : url;
	const BaseComponent = urlIfNotDisabledOrSelected ? UnstyledLink : UnstyledButton;
	const tabClassName = classNames(styles$13.Tab, icon && styles$13["Tab-iconOnly"], popoverActive && styles$13["Tab-popoverActive"], selected && styles$13["Tab-active"], selected && actions?.length && styles$13["Tab-hasActions"]);
	const badgeMarkup = badge ? /* @__PURE__ */ React.createElement(Badge, { tone: selected ? void 0 : "new" }, badge) : null;
	const disclosureMarkup = selected && actions?.length ? /* @__PURE__ */ React.createElement("div", { className: classNames(styles$13.IconWrap) }, /* @__PURE__ */ React.createElement(Icon, { source: SvgChevronDownIcon })) : null;
	const activator = /* @__PURE__ */ React.createElement(BaseComponent, {
		id,
		className: tabClassName,
		tabIndex,
		"aria-selected": selected,
		"aria-controls": panelID,
		"aria-label": accessibilityLabel,
		role: tabIndexOverride == null ? "tab" : void 0,
		disabled,
		url: urlIfNotDisabledOrSelected,
		onFocus,
		onMouseUp: handleMouseUpByBlurring,
		onClick: handleClick,
		onKeyDown: handleKeyDown
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "200",
		align: "center",
		blockAlign: "center",
		wrap: false
	}, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodySm",
		fontWeight: "medium"
	}, icon ?? content), badgeMarkup), disclosureMarkup);
	const isPlainButton = !selected || !actions?.length;
	const renameModal = renameAction ? /* @__PURE__ */ React.createElement(RenameModal, {
		name: content,
		open: activeModalType === "rename",
		onClose: handleModalClose,
		onClickPrimaryAction: handleSaveRenameModal,
		isModalLoading,
		viewNames
	}) : null;
	const duplicateModal = duplicateAction ? /* @__PURE__ */ React.createElement(DuplicateModal, {
		open: activeModalType === "duplicate",
		name: i18n.translate("Polaris.Tabs.Tab.copy", { name: content }),
		onClose: handleModalClose,
		onClickPrimaryAction: handleSaveDuplicateModal,
		isModalLoading,
		viewNames: viewNames || []
	}) : null;
	const deleteModal = deleteAction ? /* @__PURE__ */ React.createElement(Modal, {
		open: activeModalType === "delete",
		onClose: handleModalClose,
		primaryAction: {
			content: i18n.translate("Polaris.Tabs.Tab.deleteModal.delete"),
			onAction: handleConfirmDeleteView,
			destructive: true,
			disabled: isModalLoading
		},
		secondaryActions: [{
			content: i18n.translate("Polaris.Tabs.Tab.deleteModal.cancel"),
			onAction: handleModalClose
		}],
		title: i18n.translate("Polaris.Tabs.Tab.deleteModal.title"),
		instant: true
	}, /* @__PURE__ */ React.createElement(Modal.Section, null, i18n.translate("Polaris.Tabs.Tab.deleteModal.description", { viewName: content }))) : null;
	const markup = isPlainButton || disabled ? activator : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Popover, {
		active: popoverActive,
		activator,
		autofocusTarget: "first-node",
		onClose: togglePopoverActive,
		zIndexOverride: disclosureZIndexOverride
	}, /* @__PURE__ */ React.createElement("div", { className: styles$13.ActionListWrap }, /* @__PURE__ */ React.createElement(ActionList, {
		actionRole: "menuitem",
		items: formattedActions
	}))), renameModal, duplicateModal, deleteModal);
	if (icon) return markup;
	return /* @__PURE__ */ React.createElement("li", {
		className: tabContainerClassNames,
		ref: mergeRefs([node, ref]),
		role: "presentation"
	}, markup);
});
Tab.displayName = "Tab";
function focusPanelID(panelID) {
	const panel = document.getElementById(panelID);
	if (panel) panel.focus({ preventScroll: true });
}
function mergeRefs(refs) {
	return (node) => {
		for (const ref of refs) if (ref != null) ref.current = node;
	};
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tabs/components/Panel/Panel.js
function Panel({ hidden, id, tabID, children }) {
	const className = classNames(styles$13.Panel, hidden && styles$13["Panel-hidden"]);
	return /* @__PURE__ */ React.createElement("div", {
		className,
		id,
		role: "tabpanel",
		"aria-labelledby": tabID,
		tabIndex: -1
	}, children);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tabs/components/Item/Item.js
var Item$1 = /* @__PURE__ */ memo(function Item({ id, focused, children, url, accessibilityLabel, onClick = noop$3 }) {
	const focusedNode = useRef(null);
	useEffect(() => {
		const focusTarget = focusedNode.current;
		if (focusTarget && focusTarget instanceof HTMLElement && focused) requestAnimationFrame(() => {
			focusTarget.focus();
		});
	}, [focusedNode, focused]);
	const sharedProps = {
		id,
		ref: focusedNode,
		onClick,
		className: classNames(styles$13.Item),
		"aria-selected": false,
		"aria-label": accessibilityLabel
	};
	const markup = url ? /* @__PURE__ */ React.createElement(UnstyledLink, Object.assign({}, sharedProps, { url }), children) : /* @__PURE__ */ React.createElement("button", Object.assign({}, sharedProps, {
		ref: focusedNode,
		type: "button"
	}), children);
	return /* @__PURE__ */ React.createElement("li", null, markup);
});
function noop$3() {}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tabs/components/List/List.js
function List$1({ focusIndex, disclosureTabs, onClick = noop$2, onKeyPress = noop$2 }) {
	const tabs = disclosureTabs.map(({ id, content, ...tabProps }, index) => {
		return /* @__PURE__ */ React.createElement(Item$1, Object.assign({ key: id }, tabProps, {
			id,
			focused: index === focusIndex,
			onClick: onClick.bind(null, id)
		}), content);
	});
	return /* @__PURE__ */ React.createElement("ul", {
		className: styles$13.List,
		onKeyDown: handleKeyDown,
		onKeyUp: onKeyPress
	}, tabs);
}
function noop$2() {}
function handleKeyDown(event) {
	const { key } = event;
	if (key === "ArrowLeft" || key === "ArrowRight") {
		event.preventDefault();
		event.stopPropagation();
	}
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tabs/components/CreateViewModal/CreateViewModal.js
var MAX_VIEW_NAME_LENGTH = 40;
function CreateViewModal({ activator, open, onClose, onClickPrimaryAction, onClickSecondaryAction, viewNames }) {
	const i18n = useI18n();
	const [value, setValue] = useState("");
	const [loading, setLoading] = useState(false);
	const container = useRef(null);
	const isTouchDevice = useIsTouchDevice();
	const hasSameNameError = viewNames.some((viewName) => viewName.trim().toLowerCase() === value.trim().toLowerCase());
	const isPrimaryActionDisabled = !value || hasSameNameError || loading || value.length > MAX_VIEW_NAME_LENGTH;
	useEffect(() => {
		if (!container.current || isTouchDevice) return;
		if (open) {
			focusFirstFocusableNode(container.current);
			const timeout = setTimeout(() => {
				if (!container.current) return;
				focusFirstFocusableNode(container.current);
			}, 50);
			return () => clearTimeout(timeout);
		}
	}, [open, isTouchDevice]);
	const handleChange = useCallback((newValue) => {
		setValue(newValue);
	}, []);
	async function handlePrimaryAction() {
		if (hasSameNameError || isPrimaryActionDisabled) return;
		setLoading(true);
		await onClickPrimaryAction(value);
		setLoading(false);
		setValue("");
		onClose();
	}
	function handleSecondaryAction() {
		onClickSecondaryAction?.();
		setValue("");
		onClose();
	}
	return /* @__PURE__ */ React.createElement(Modal, {
		activator,
		open,
		onClose,
		title: i18n.translate("Polaris.Tabs.CreateViewModal.title"),
		primaryAction: {
			content: i18n.translate("Polaris.Tabs.CreateViewModal.create"),
			onAction: handlePrimaryAction,
			disabled: isPrimaryActionDisabled
		},
		secondaryActions: [{
			content: i18n.translate("Polaris.Tabs.CreateViewModal.cancel"),
			onAction: handleSecondaryAction
		}]
	}, /* @__PURE__ */ React.createElement(Modal.Section, null, /* @__PURE__ */ React.createElement(Form$1, { onSubmit: handlePrimaryAction }, /* @__PURE__ */ React.createElement(FormLayout, null, /* @__PURE__ */ React.createElement("div", { ref: container }, /* @__PURE__ */ React.createElement(TextField, {
		label: i18n.translate("Polaris.Tabs.CreateViewModal.label"),
		value,
		onChange: handleChange,
		autoComplete: "off",
		maxLength: MAX_VIEW_NAME_LENGTH,
		showCharacterCount: true,
		error: hasSameNameError ? i18n.translate("Polaris.Tabs.CreateViewModal.errors.sameName", { name: value }) : void 0
	}))))));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tabs/components/TabMeasurer/TabMeasurer.js
var TabMeasurer = /* @__PURE__ */ memo(function TabMeasurer({ selected, tabs, activator, tabToFocus, siblingTabHasFocus, handleMeasurement: handleMeasurementProp }) {
	const containerNode = useRef(null);
	const animationFrame = useRef(null);
	const handleMeasurement = useCallback(() => {
		if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
		animationFrame.current = requestAnimationFrame(() => {
			if (!containerNode.current) return;
			const containerWidth = containerNode.current.offsetWidth - 20 - 28;
			const hiddenTabNodes = containerNode.current.children;
			const hiddenTabWidths = Array.from(hiddenTabNodes).map((node) => {
				return Math.ceil(node.getBoundingClientRect().width) + 4;
			});
			handleMeasurementProp({
				containerWidth,
				disclosureWidth: hiddenTabWidths.pop() || 0,
				hiddenTabWidths
			});
		});
	}, [handleMeasurementProp]);
	useEffect(() => {
		handleMeasurement();
	}, [handleMeasurement, tabs]);
	useComponentDidMount(() => {
		if (process.env.NODE_ENV === "development") setTimeout(handleMeasurement, 0);
	});
	const tabsMarkup = tabs.map((tab, index) => {
		return /* @__PURE__ */ React.createElement(Tab, {
			measuring: true,
			key: `$${tab.id}Hidden`,
			id: `${tab.id}Measurer`,
			siblingTabHasFocus,
			focused: index === tabToFocus,
			selected: index === selected,
			url: tab.url,
			content: tab.content,
			onTogglePopover: noop$1,
			onToggleModal: noop$1
		});
	});
	const classname = classNames(styles$13.Tabs, styles$13.TabsMeasurer);
	useEventListener("resize", handleMeasurement);
	return /* @__PURE__ */ React.createElement("div", {
		className: classname,
		ref: containerNode
	}, tabsMarkup, activator);
});
function noop$1() {}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Tabs/Tabs.js
var CREATE_NEW_VIEW_ID = "create-new-view";
var Tabs = ({ tabs, children, selected, newViewAccessibilityLabel, canCreateNewView, disabled, onCreateNewView, onSelect, fitted, disclosureText, disclosureZIndexOverride }) => {
	const i18n = useI18n();
	const { mdDown } = useBreakpoints();
	const scrollRef = useRef(null);
	const wrapRef = useRef(null);
	const selectedTabRef = useRef(null);
	const [state, setState] = useReducer((data, partialData) => {
		return {
			...data,
			...partialData
		};
	}, {
		disclosureWidth: 0,
		containerWidth: Infinity,
		tabWidths: [],
		visibleTabs: [],
		hiddenTabs: [],
		showDisclosure: false,
		tabToFocus: -1,
		isNewViewModalActive: false,
		modalSubmitted: false,
		isTabsFocused: false,
		isTabPopoverOpen: false,
		isTabModalOpen: false
	});
	const { tabToFocus, visibleTabs, hiddenTabs, showDisclosure, isNewViewModalActive, modalSubmitted, disclosureWidth, tabWidths, containerWidth, isTabsFocused, isTabModalOpen, isTabPopoverOpen } = state;
	const prevModalOpen = usePrevious(isTabModalOpen);
	const prevPopoverOpen = usePrevious(isTabPopoverOpen);
	useEffect(() => {
		const hasModalClosed = prevModalOpen && !isTabModalOpen;
		const hasPopoverClosed = prevPopoverOpen && !isTabPopoverOpen;
		if (hasModalClosed) setState({
			isTabsFocused: true,
			tabToFocus: selected
		});
		else if (hasPopoverClosed && !isTabModalOpen) setState({
			isTabsFocused: true,
			tabToFocus: selected
		});
	}, [
		prevPopoverOpen,
		isTabPopoverOpen,
		prevModalOpen,
		isTabModalOpen,
		selected,
		tabToFocus
	]);
	const handleTogglePopover = useCallback((isOpen) => setState({ isTabPopoverOpen: isOpen }), []);
	const handleToggleModal = useCallback((isOpen) => setState({ isTabModalOpen: isOpen }), []);
	const handleCloseNewViewModal = () => {
		setState({ isNewViewModalActive: false });
	};
	const handleSaveNewViewModal = async (value) => {
		if (!onCreateNewView) return false;
		const hasExecuted = await onCreateNewView?.(value);
		if (hasExecuted) setState({ modalSubmitted: true });
		return hasExecuted;
	};
	const handleClickNewTab = () => {
		setState({ isNewViewModalActive: true });
	};
	const handleTabClick = useCallback((id) => {
		const tab = tabs.find((aTab) => aTab.id === id);
		if (tab == null) return null;
		const selectedIndex = tabs.indexOf(tab);
		onSelect?.(selectedIndex);
	}, [tabs, onSelect]);
	const renderTabMarkup = useCallback((tab, index) => {
		const handleClick = () => {
			handleTabClick(tab.id);
			tab.onAction?.();
		};
		const viewNames = tabs.map(({ content }) => content);
		const tabPanelID = tab.panelID || `${tab.id}-panel`;
		return /* @__PURE__ */ React.createElement(Tab, Object.assign({}, tab, {
			key: `${index}-${tab.id}`,
			id: tab.id,
			panelID: children ? tabPanelID : void 0,
			disabled: disabled || tab.disabled,
			siblingTabHasFocus: tabToFocus > -1,
			focused: index === tabToFocus,
			selected: index === selected,
			onAction: handleClick,
			accessibilityLabel: tab.accessibilityLabel,
			url: tab.url,
			content: tab.content,
			onToggleModal: handleToggleModal,
			onTogglePopover: handleTogglePopover,
			viewNames,
			disclosureZIndexOverride,
			ref: index === selected ? selectedTabRef : null
		}));
	}, [
		disabled,
		tabs,
		children,
		selected,
		tabToFocus,
		disclosureZIndexOverride,
		handleTabClick,
		handleToggleModal,
		handleTogglePopover
	]);
	const handleFocus = useCallback((event) => {
		const target = event.target;
		const isItem = target.classList.contains(styles$13.Item);
		const isInNaturalDOMOrder = target.closest(`[data-tabs-focus-catchment]`) || isItem;
		if (target.classList.contains(styles$13.DisclosureActivator) || !isInNaturalDOMOrder) return;
		setState({ isTabsFocused: true });
	}, []);
	const handleBlur = useCallback((event) => {
		const target = event.target;
		const relatedTarget = event.relatedTarget;
		const isInNaturalDOMOrder = relatedTarget?.closest?.(`.${styles$13.Tabs}`);
		const targetIsATab = target?.classList?.contains?.(styles$13.Tab);
		const focusReceiverIsAnItem = relatedTarget?.classList.contains(styles$13.Item);
		if (!relatedTarget && !isTabModalOpen && !targetIsATab && !focusReceiverIsAnItem) {
			setState({ tabToFocus: -1 });
			return;
		}
		if (!isInNaturalDOMOrder && !isTabModalOpen && !targetIsATab && !focusReceiverIsAnItem) {
			setState({ tabToFocus: -1 });
			return;
		}
		setState({ isTabsFocused: false });
	}, [isTabModalOpen]);
	const handleKeyDown = (event) => {
		if (isTabPopoverOpen || isTabModalOpen || isNewViewModalActive) return;
		const { key } = event;
		if (key === "ArrowLeft" || key === "ArrowRight") {
			event.preventDefault();
			event.stopPropagation();
		}
	};
	useEffect(() => {
		const { visibleTabs, hiddenTabs } = getVisibleAndHiddenTabIndices(tabs, selected, disclosureWidth, tabWidths, containerWidth);
		setState({
			visibleTabs,
			hiddenTabs
		});
	}, [
		containerWidth,
		disclosureWidth,
		tabs,
		selected,
		tabWidths,
		setState
	]);
	const moveToSelectedTab = useCallback(() => {
		const activeButton = selectedTabRef.current?.querySelector(`.${styles$13["Tab-active"]}`);
		if (activeButton) moveToActiveTab(activeButton.offsetLeft);
	}, []);
	useEffect(() => {
		if (mdDown) moveToSelectedTab();
	}, [
		moveToSelectedTab,
		selected,
		mdDown
	]);
	useEffect(() => {
		if (isTabsFocused && !showDisclosure) setState({ tabToFocus: selected });
	}, [
		isTabsFocused,
		selected,
		setState,
		showDisclosure
	]);
	const handleKeyPress = (event) => {
		const { showDisclosure, visibleTabs, hiddenTabs, tabToFocus, isNewViewModalActive } = state;
		if (isTabModalOpen || isTabPopoverOpen || isNewViewModalActive) return;
		const key = event.key;
		const tabsArrayInOrder = showDisclosure || mdDown ? visibleTabs.concat(hiddenTabs) : [...visibleTabs];
		let newFocus = tabsArrayInOrder.indexOf(tabToFocus);
		if (key === "ArrowRight") {
			newFocus += 1;
			if (newFocus === tabsArrayInOrder.length) newFocus = 0;
		}
		if (key === "ArrowLeft") if (newFocus === -1 || newFocus === 0) newFocus = tabsArrayInOrder.length - 1;
		else newFocus -= 1;
		const buttonToFocus = tabsArrayInOrder[newFocus];
		if (buttonToFocus != null) setState({ tabToFocus: buttonToFocus });
	};
	const handleDisclosureActivatorClick = () => {
		setState({
			showDisclosure: !showDisclosure,
			tabToFocus: hiddenTabs[0]
		});
	};
	const handleClose = () => {
		setState({ showDisclosure: false });
	};
	const handleMeasurement = useCallback((measurements) => {
		const { hiddenTabWidths: tabWidths, containerWidth, disclosureWidth } = measurements;
		const { visibleTabs, hiddenTabs } = getVisibleAndHiddenTabIndices(tabs, selected, disclosureWidth, tabWidths, containerWidth);
		setState({
			visibleTabs,
			hiddenTabs,
			disclosureWidth,
			containerWidth,
			tabWidths
		});
	}, [
		tabs,
		selected,
		setState
	]);
	const handleListTabClick = (id) => {
		handleTabClick(id);
		handleClose();
		setState({ isTabsFocused: true });
	};
	const moveToActiveTab = (offsetLeft) => {
		setTimeout(() => {
			if (scrollRef.current && typeof scrollRef.current.scroll === "function") {
				const scrollRefOffset = wrapRef?.current?.offsetLeft || 0;
				scrollRef?.current?.scroll({ left: offsetLeft - scrollRefOffset });
			}
		}, 0);
	};
	const createViewA11yLabel = newViewAccessibilityLabel || i18n.translate("Polaris.Tabs.newViewAccessibilityLabel");
	const tabsToShow = mdDown ? [...visibleTabs, ...hiddenTabs] : visibleTabs;
	const tabsMarkup = tabsToShow.sort((tabA, tabB) => tabA - tabB).filter((tabIndex) => tabs[tabIndex]).map((tabIndex) => renderTabMarkup(tabs[tabIndex], tabIndex));
	const disclosureActivatorVisible = visibleTabs.length < tabs.length && !mdDown;
	const classname = classNames(styles$13.Tabs, fitted && styles$13.fitted, disclosureActivatorVisible && styles$13.fillSpace);
	const wrapperClassNames = classNames(styles$13.Wrapper, canCreateNewView && styles$13.WrapperWithNewButton);
	const disclosureTabClassName = classNames(styles$13.DisclosureTab, disclosureActivatorVisible && styles$13["DisclosureTab-visible"]);
	const disclosureButtonClassName = classNames(styles$13.DisclosureActivator);
	const disclosureButtonContent = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodySm",
		fontWeight: "medium"
	}, disclosureText ?? i18n.translate("Polaris.Tabs.toggleTabsLabel")), /* @__PURE__ */ React.createElement("div", { className: classNames(styles$13.IconWrap, disclosureActivatorVisible && showDisclosure && styles$13["IconWrap-open"]) }, /* @__PURE__ */ React.createElement(Icon, {
		source: SvgChevronDownIcon,
		tone: "subdued"
	})));
	const activator = /* @__PURE__ */ React.createElement(UnstyledButton, {
		type: "button",
		className: disclosureButtonClassName,
		onClick: handleDisclosureActivatorClick,
		"aria-label": disclosureText ?? i18n.translate("Polaris.Tabs.toggleTabsLabel"),
		disabled
	}, disclosureButtonContent);
	const disclosureTabs = hiddenTabs.map((tabIndex) => tabs[tabIndex]);
	const viewNames = tabs.map(({ content }) => content);
	const tabMeasurer = /* @__PURE__ */ React.createElement(TabMeasurer, {
		tabToFocus,
		activator,
		selected,
		tabs,
		siblingTabHasFocus: tabToFocus > -1,
		handleMeasurement
	});
	const newTab = /* @__PURE__ */ React.createElement(Tab, {
		id: CREATE_NEW_VIEW_ID,
		content: createViewA11yLabel,
		actions: [],
		onAction: handleClickNewTab,
		onFocus: () => {
			if (modalSubmitted) setState({
				tabToFocus: selected,
				modalSubmitted: false
			});
		},
		icon: /* @__PURE__ */ React.createElement(Icon, {
			source: SvgPlusIcon,
			accessibilityLabel: createViewA11yLabel
		}),
		disabled,
		onTogglePopover: handleTogglePopover,
		onToggleModal: handleToggleModal,
		tabIndexOverride: 0
	});
	const panelMarkup = children ? tabs.map((_tab, index) => {
		return selected === index ? /* @__PURE__ */ React.createElement(Panel, {
			id: tabs[index].panelID || `${tabs[index].id}-panel`,
			tabID: tabs[index].id,
			key: tabs[index].id
		}, children) : /* @__PURE__ */ React.createElement(Panel, {
			id: tabs[index].panelID || `${tabs[index].id}-panel`,
			tabID: tabs[index].id,
			key: tabs[index].id,
			hidden: true
		});
	}) : null;
	return /* @__PURE__ */ React.createElement("div", { className: styles$13.Outer }, /* @__PURE__ */ React.createElement(Box, { padding: { md: "200" } }, tabMeasurer, /* @__PURE__ */ React.createElement("div", {
		className: wrapperClassNames,
		ref: scrollRef
	}, /* @__PURE__ */ React.createElement("div", {
		className: styles$13.ButtonWrapper,
		ref: wrapRef
	}, /* @__PURE__ */ React.createElement("ul", {
		role: tabsMarkup.length > 0 ? "tablist" : void 0,
		className: classname,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onKeyDown: handleKeyDown,
		onKeyUp: handleKeyPress,
		"data-tabs-focus-catchment": true
	}, tabsMarkup, mdDown || tabsToShow.length === 0 ? null : /* @__PURE__ */ React.createElement("li", {
		className: disclosureTabClassName,
		role: "presentation"
	}, /* @__PURE__ */ React.createElement(Popover, {
		preferredPosition: "below",
		preferredAlignment: "left",
		activator,
		active: disclosureActivatorVisible && showDisclosure,
		onClose: handleClose,
		autofocusTarget: "first-node",
		zIndexOverride: disclosureZIndexOverride
	}, /* @__PURE__ */ React.createElement(List$1, {
		focusIndex: hiddenTabs.indexOf(tabToFocus),
		disclosureTabs,
		onClick: handleListTabClick,
		onKeyPress: handleKeyPress
	})))), canCreateNewView && tabsToShow.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: styles$13.NewTab }, /* @__PURE__ */ React.createElement(CreateViewModal, {
		open: isNewViewModalActive,
		onClose: handleCloseNewViewModal,
		onClickPrimaryAction: handleSaveNewViewModal,
		viewNames,
		activator: disabled ? newTab : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Tooltip, {
			content: i18n.translate("Polaris.Tabs.newViewTooltip"),
			preferredPosition: "above",
			hoverDelay: 400,
			zIndexOverride: disclosureZIndexOverride
		}, newTab))
	})) : null))), panelMarkup);
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/components/SearchFilterButton/SearchFilterButton.js
function SearchFilterButton({ onClick, label, disabled, tooltipContent, disclosureZIndexOverride, style, hideFilters, hideQueryField }) {
	const iconMarkup = /* @__PURE__ */ React.createElement(InlineStack, { gap: "0" }, hideQueryField ? null : /* @__PURE__ */ React.createElement(Icon, {
		source: SvgSearchIcon,
		tone: "base"
	}), hideFilters ? null : /* @__PURE__ */ React.createElement(Icon, {
		source: SvgFilterIcon,
		tone: "base"
	}));
	const activator = /* @__PURE__ */ React.createElement("div", { style }, /* @__PURE__ */ React.createElement(Button, {
		size: "slim",
		onClick,
		disabled,
		icon: iconMarkup,
		accessibilityLabel: label
	}));
	const content = /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd",
		alignment: "center"
	}, tooltipContent);
	return /* @__PURE__ */ React.createElement(Tooltip, {
		content,
		preferredPosition: "above",
		hoverDelay: 400,
		zIndexOverride: disclosureZIndexOverride
	}, activator);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/components/EditColumnsButton/EditColumnsButton.js
function EditColumnsButton({ onClick, disabled }) {
	const i18n = useI18n();
	const tooltipContent = /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd",
		alignment: "center"
	}, i18n.translate("Polaris.IndexFilters.EditColumnsButton.tooltip"));
	return /* @__PURE__ */ React.createElement(Tooltip, {
		content: tooltipContent,
		preferredPosition: "above",
		hoverDelay: 400
	}, /* @__PURE__ */ React.createElement(Button, {
		size: "slim",
		onClick,
		disabled,
		icon: SvgLayoutColumns3Icon,
		accessibilityLabel: i18n.translate("Polaris.IndexFilters.EditColumnsButton.accessibilityLabel")
	}));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexFilters/IndexFilters.js
var DEFAULT_IGNORED_TAGS = [
	"INPUT",
	"SELECT",
	"TEXTAREA"
];
var TRANSITION_DURATION = 150;
var defaultStyle = {
	transition: `opacity ${TRANSITION_DURATION}ms var(--p-motion-ease)`,
	opacity: 0
};
var transitionStyles = {
	entering: { opacity: 1 },
	entered: { opacity: 1 },
	exiting: { opacity: 0 },
	exited: { opacity: 0 },
	unmounted: { opacity: 0 }
};
function IndexFilters({ tabs, selected, onSelect, onSort, onSortKeyChange, onSortDirectionChange, onAddFilterClick, sortOptions, sortSelected, queryValue = "", queryPlaceholder, primaryAction, cancelAction, filters, appliedFilters, onClearAll, onQueryChange, onQueryFocus, onQueryClear, onEditStart, disabled, disableQueryField, hideFilters, loading, mode, setMode, disclosureZIndexOverride, disableStickyMode, isFlushWhenSticky = false, canCreateNewView = true, onCreateNewView, filteringAccessibilityLabel, filteringAccessibilityTooltip, hideQueryField, closeOnChildOverlayClick, disableKeyboardShortcuts, showEditColumnsButton, autoFocusSearchField = true }) {
	const i18n = useI18n();
	const { mdDown } = useBreakpoints();
	const defaultRef = useRef(null);
	const filteringRef = useRef(null);
	const { value: filtersFocused, setFalse: setFiltersUnFocused, setTrue: setFiltersFocused } = useToggle(mode === IndexFiltersMode.Filtering && autoFocusSearchField);
	const handleModeChange = (newMode) => {
		if (newMode === IndexFiltersMode.Filtering && autoFocusSearchField) setFiltersFocused();
		else setFiltersUnFocused();
	};
	useOnValueChange(mode, handleModeChange);
	useEventListener("keydown", (event) => {
		if (disableKeyboardShortcuts || hideQueryField && hideFilters) return;
		const { key } = event;
		const tag = document?.activeElement?.tagName;
		if (mode !== IndexFiltersMode.Default && event.key === "Escape") onPressEscape();
		if (key === "f" && mode === IndexFiltersMode.Default) {
			if (tag && DEFAULT_IGNORED_TAGS.includes(tag)) return;
			onPressF();
			event.preventDefault();
		}
	});
	const { intersectionRef, measurerRef, indexFilteringHeight, isSticky } = useIsSticky(mode, Boolean(disableStickyMode), isFlushWhenSticky);
	const viewNames = tabs.map(({ content }) => content);
	const handleChangeSortButton = useCallback((value) => {
		onSort?.(value);
	}, [onSort]);
	const handleChangeSearch = useCallback((value) => {
		onQueryChange(value);
	}, [onQueryChange]);
	const useExecutedCallback = (action, afterEffect) => useCallback(async (name) => {
		if (await action?.(name)) {
			setMode(IndexFiltersMode.Default);
			afterEffect?.();
		}
	}, [action, afterEffect]);
	const onExecutedPrimaryAction = useExecutedCallback(primaryAction?.onAction);
	const onExecutedCancelAction = useCallback(() => {
		cancelAction?.onAction?.();
		setMode(IndexFiltersMode.Default);
	}, [cancelAction, setMode]);
	const enhancedPrimaryAction = useMemo(() => {
		return primaryAction ? {
			...primaryAction,
			onAction: onExecutedPrimaryAction
		} : void 0;
	}, [onExecutedPrimaryAction, primaryAction]);
	const enhancedCancelAction = useMemo(() => {
		return cancelAction ? {
			...cancelAction,
			onAction: onExecutedCancelAction
		} : void 0;
	}, [cancelAction, onExecutedCancelAction]);
	const beginEdit = useCallback((mode) => {
		setMode(mode);
		onEditStart?.(mode);
	}, [onEditStart, setMode]);
	const updateButtonsMarkup = useMemo(() => enhancedCancelAction || enhancedPrimaryAction ? /* @__PURE__ */ React.createElement(UpdateButtons, {
		primaryAction: enhancedPrimaryAction,
		cancelAction: enhancedCancelAction,
		viewNames,
		disabled
	}) : null, [
		enhancedPrimaryAction,
		enhancedCancelAction,
		disabled,
		viewNames
	]);
	const sortMarkup = useMemo(() => {
		if (!sortOptions?.length) return null;
		return /* @__PURE__ */ React.createElement(SortButton, {
			choices: sortOptions,
			selected: sortSelected,
			onChange: handleChangeSortButton,
			onChangeKey: onSortKeyChange,
			onChangeDirection: onSortDirectionChange,
			disabled,
			disclosureZIndexOverride
		});
	}, [
		handleChangeSortButton,
		onSortDirectionChange,
		onSortKeyChange,
		sortOptions,
		sortSelected,
		disabled,
		disclosureZIndexOverride
	]);
	function handleClickEditColumnsButton() {
		beginEdit(IndexFiltersMode.EditingColumns);
	}
	const editColumnsMarkup = showEditColumnsButton ? /* @__PURE__ */ React.createElement(EditColumnsButton, {
		onClick: handleClickEditColumnsButton,
		disabled
	}) : null;
	const isActionLoading = primaryAction?.loading || cancelAction?.loading;
	function handleClickFilterButton() {
		beginEdit(IndexFiltersMode.Filtering);
	}
	const searchFilterTooltipLabelId = disableKeyboardShortcuts ? "Polaris.IndexFilters.searchFilterTooltip" : "Polaris.IndexFilters.searchFilterTooltipWithShortcut";
	const searchFilterTooltip = filteringAccessibilityTooltip || i18n.translate(searchFilterTooltipLabelId);
	const searchFilterAriaLabel = filteringAccessibilityLabel || i18n.translate("Polaris.IndexFilters.searchFilterAccessibilityLabel");
	const isLoading = loading || isActionLoading;
	function onPressEscape() {
		cancelAction?.onAction();
		setMode(IndexFiltersMode.Default);
	}
	function handleClearSearch() {
		onQueryClear?.();
	}
	function handleQueryBlur() {
		setFiltersUnFocused();
	}
	function handleQueryFocus() {
		setFiltersFocused();
		onQueryFocus?.();
	}
	function onPressF() {
		if (mode !== IndexFiltersMode.Default) return;
		beginEdit(IndexFiltersMode.Filtering);
	}
	return /* @__PURE__ */ React.createElement("div", {
		className: styles$16.IndexFiltersWrapper,
		style: { height: indexFilteringHeight }
	}, /* @__PURE__ */ React.createElement("div", { ref: intersectionRef }), /* @__PURE__ */ React.createElement("div", {
		className: classNames(styles$16.IndexFilters, isSticky && styles$16.IndexFiltersSticky, isSticky && isFlushWhenSticky && styles$16.IndexFiltersStickyFlush),
		ref: measurerRef
	}, /* @__PURE__ */ React.createElement(Transition, {
		nodeRef: defaultRef,
		in: mode !== IndexFiltersMode.Filtering,
		timeout: TRANSITION_DURATION
	}, (state) => /* @__PURE__ */ React.createElement("div", { ref: defaultRef }, mode !== IndexFiltersMode.Filtering ? /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(InlineStack, {
		align: "start",
		blockAlign: "center",
		gap: {
			xs: "0",
			md: "200"
		},
		wrap: false
	}, /* @__PURE__ */ React.createElement("div", { className: classNames(styles$16.TabsWrapper, mdDown && styles$16.SmallScreenTabsWrapper, isLoading && styles$16.TabsWrapperLoading) }, /* @__PURE__ */ React.createElement("div", {
		className: styles$16.TabsInner,
		style: {
			...defaultStyle,
			...transitionStyles[state]
		}
	}, /* @__PURE__ */ React.createElement(Tabs, {
		tabs,
		selected,
		onSelect,
		disabled: Boolean(mode !== IndexFiltersMode.Default || disabled),
		disclosureZIndexOverride,
		canCreateNewView,
		onCreateNewView
	})), isLoading && mdDown && /* @__PURE__ */ React.createElement("div", { className: styles$16.TabsLoading }, /* @__PURE__ */ React.createElement(Spinner$1, { size: "small" }))), /* @__PURE__ */ React.createElement("div", { className: styles$16.ActionWrap }, isLoading && !mdDown && /* @__PURE__ */ React.createElement("div", { className: styles$16.DesktopLoading }, isLoading ? /* @__PURE__ */ React.createElement(Spinner$1, { size: "small" }) : null), mode === IndexFiltersMode.Default ? /* @__PURE__ */ React.createElement(React.Fragment, null, hideFilters && hideQueryField ? null : /* @__PURE__ */ React.createElement(SearchFilterButton, {
		onClick: handleClickFilterButton,
		label: searchFilterAriaLabel,
		tooltipContent: searchFilterTooltip,
		disabled,
		hideFilters,
		hideQueryField,
		style: {
			...defaultStyle,
			...transitionStyles[state]
		},
		disclosureZIndexOverride
	}), editColumnsMarkup, sortMarkup) : null, mode === IndexFiltersMode.EditingColumns ? updateButtonsMarkup : null))) : null)), /* @__PURE__ */ React.createElement(Transition, {
		nodeRef: filteringRef,
		in: mode === IndexFiltersMode.Filtering,
		timeout: TRANSITION_DURATION
	}, (state) => /* @__PURE__ */ React.createElement("div", { ref: filteringRef }, mode === IndexFiltersMode.Filtering ? /* @__PURE__ */ React.createElement(Filters, {
		queryValue,
		queryPlaceholder,
		onQueryChange: handleChangeSearch,
		onQueryClear: handleClearSearch,
		onQueryFocus: handleQueryFocus,
		onQueryBlur: handleQueryBlur,
		onAddFilterClick,
		filters,
		appliedFilters,
		onClearAll,
		disableFilters: disabled,
		hideFilters,
		hideQueryField,
		disableQueryField: disabled || disableQueryField,
		loading: loading || isActionLoading,
		focused: filtersFocused,
		mountedState: mdDown ? void 0 : state,
		borderlessQueryField: true,
		closeOnChildOverlayClick
	}, /* @__PURE__ */ React.createElement("div", { className: styles$16.ButtonWrap }, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "200",
		align: "start",
		blockAlign: "center"
	}, /* @__PURE__ */ React.createElement("div", { style: {
		...defaultStyle,
		...transitionStyles[state]
	} }, updateButtonsMarkup), sortMarkup))) : null))));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexTable/IndexTable.css.js
var styles$12 = {
	"IndexTable": "Polaris-IndexTable",
	"IndexTableWrapper": "Polaris-IndexTable__IndexTableWrapper",
	"IndexTableWrapper-scrollBarHidden": "Polaris-IndexTable__IndexTableWrapper--scrollBarHidden",
	"IndexTableWrapperWithSelectAllActions": "Polaris-IndexTable__IndexTableWrapperWithSelectAllActions",
	"LoadingPanel": "Polaris-IndexTable__LoadingPanel",
	"LoadingPanelEntered": "Polaris-IndexTable__LoadingPanelEntered",
	"LoadingPanelRow": "Polaris-IndexTable__LoadingPanelRow",
	"LoadingPanelText": "Polaris-IndexTable__LoadingPanelText",
	"Table": "Polaris-IndexTable__Table",
	"Table-scrolling": "Polaris-IndexTable__Table--scrolling",
	"TableCell-first": "Polaris-IndexTable__TableCell--first",
	"StickyTable-scrolling": "Polaris-IndexTable__StickyTable--scrolling",
	"TableCell": "Polaris-IndexTable__TableCell",
	"TableHeading-first": "Polaris-IndexTable__TableHeading--first",
	"TableHeading-second": "Polaris-IndexTable__TableHeading--second",
	"Table-sticky": "Polaris-IndexTable__Table--sticky",
	"StickyTable": "Polaris-IndexTable__StickyTable",
	"Table-unselectable": "Polaris-IndexTable__Table--unselectable",
	"TableRow": "Polaris-IndexTable__TableRow",
	"TableRow-unclickable": "Polaris-IndexTable__TableRow--unclickable",
	"toneSuccess": "Polaris-IndexTable--toneSuccess",
	"TableRow-child": "Polaris-IndexTable__TableRow--child",
	"toneWarning": "Polaris-IndexTable--toneWarning",
	"toneCritical": "Polaris-IndexTable--toneCritical",
	"toneSubdued": "Polaris-IndexTable--toneSubdued",
	"TableRow-subheader": "Polaris-IndexTable__TableRow--subheader",
	"TableRow-selected": "Polaris-IndexTable__TableRow--selected",
	"TableRow-hovered": "Polaris-IndexTable__TableRow--hovered",
	"TableRow-disabled": "Polaris-IndexTable__TableRow--disabled",
	"ZebraStriping": "Polaris-IndexTable__ZebraStriping",
	"TableHeading": "Polaris-IndexTable__TableHeading",
	"TableHeading-flush": "Polaris-IndexTable__TableHeading--flush",
	"TableHeading-align-center": "Polaris-IndexTable--tableHeadingAlignCenter",
	"TableHeading-align-end": "Polaris-IndexTable--tableHeadingAlignEnd",
	"TableHeading-extra-padding-right": "Polaris-IndexTable--tableHeadingExtraPaddingRight",
	"TableHeading-sortable": "Polaris-IndexTable__TableHeading--sortable",
	"TableHeadingSortButton": "Polaris-IndexTable__TableHeadingSortButton",
	"TableHeadingSortIcon": "Polaris-IndexTable__TableHeadingSortIcon",
	"TableHeadingSortButton-heading-align-end": "Polaris-IndexTable--tableHeadingSortButtonHeadingAlignEnd",
	"TableHeadingSortButton-heading-align-end-currently-sorted": "Polaris-IndexTable--tableHeadingSortButtonHeadingAlignEndCurrentlySorted",
	"TableHeadingSortIcon-heading-align-end": "Polaris-IndexTable--tableHeadingSortIconHeadingAlignEnd",
	"TableHeadingSortButton-heading-align-end-previously-sorted": "Polaris-IndexTable--tableHeadingSortButtonHeadingAlignEndPreviouslySorted",
	"right-aligned-sort-button-slide-out": "Polaris-IndexTable--rightAlignedSortButtonSlideOut",
	"reveal-right-aligned-sort-button-icon": "Polaris-IndexTable--revealRightAlignedSortButtonIcon",
	"TableHeadingUnderline": "Polaris-IndexTable__TableHeadingUnderline",
	"TableHeadingTooltipUnderlinePlaceholder": "Polaris-IndexTable__TableHeadingTooltipUnderlinePlaceholder",
	"TableHeadingSortIcon-visible": "Polaris-IndexTable__TableHeadingSortIcon--visible",
	"TableHeadingSortSvg": "Polaris-IndexTable__TableHeadingSortSvg",
	"SortableTableHeadingWithCustomMarkup": "Polaris-IndexTable__SortableTableHeadingWithCustomMarkup",
	"SortableTableHeaderWrapper": "Polaris-IndexTable__SortableTableHeaderWrapper",
	"ColumnHeaderCheckboxWrapper": "Polaris-IndexTable__ColumnHeaderCheckboxWrapper",
	"FirstStickyHeaderElement": "Polaris-IndexTable__FirstStickyHeaderElement",
	"TableHeading-unselectable": "Polaris-IndexTable__TableHeading--unselectable",
	"TableCell-flush": "Polaris-IndexTable__TableCell--flush",
	"Table-sticky-scrolling": "Polaris-IndexTable--tableStickyScrolling",
	"StickyTableHeader-sticky-scrolling": "Polaris-IndexTable--stickyTableHeaderStickyScrolling",
	"TableHeading-last": "Polaris-IndexTable__TableHeading--last",
	"Table-sticky-last": "Polaris-IndexTable--tableStickyLast",
	"StickyTableHeader-sticky-last": "Polaris-IndexTable--stickyTableHeaderStickyLast",
	"Table-sortable": "Polaris-IndexTable__Table--sortable",
	"StickyTableHeader": "Polaris-IndexTable__StickyTableHeader",
	"StickyTableHeader-isSticky": "Polaris-IndexTable__StickyTableHeader--isSticky",
	"StickyTableHeadings": "Polaris-IndexTable__StickyTableHeadings",
	"StickyTableHeading-second": "Polaris-IndexTable__StickyTableHeading--second",
	"unselectable": "Polaris-IndexTable--unselectable",
	"StickyTableHeading-second-scrolling": "Polaris-IndexTable--stickyTableHeadingSecondScrolling",
	"ScrollLeft": "Polaris-IndexTable__ScrollLeft",
	"ScrollRight": "Polaris-IndexTable__ScrollRight",
	"ScrollRight-onboarding": "Polaris-IndexTable__ScrollRight--onboarding",
	"SelectAllActionsWrapper": "Polaris-IndexTable__SelectAllActionsWrapper",
	"SelectAllActionsWrapperWithPagination": "Polaris-IndexTable__SelectAllActionsWrapperWithPagination",
	"SelectAllActionsWrapperSticky": "Polaris-IndexTable__SelectAllActionsWrapperSticky",
	"SelectAllActionsWrapperAtEnd": "Polaris-IndexTable__SelectAllActionsWrapperAtEnd",
	"SelectAllActionsWrapperAtEndAppear": "Polaris-IndexTable__SelectAllActionsWrapperAtEndAppear",
	"BulkActionsWrapper": "Polaris-IndexTable__BulkActionsWrapper",
	"BulkActionsWrapperVisible": "Polaris-IndexTable__BulkActionsWrapperVisible",
	"PaginationWrapper": "Polaris-IndexTable__PaginationWrapper",
	"PaginationWrapperScrolledPastTop": "Polaris-IndexTable__PaginationWrapperScrolledPastTop",
	"ScrollBarContainer": "Polaris-IndexTable__ScrollBarContainer",
	"ScrollBarContainerWithPagination": "Polaris-IndexTable__ScrollBarContainerWithPagination",
	"ScrollBarContainerScrolledPastTop": "Polaris-IndexTable__ScrollBarContainerScrolledPastTop",
	"ScrollBarContainerWithSelectAllActions": "Polaris-IndexTable__ScrollBarContainerWithSelectAllActions",
	"ScrollBarContainerSelectAllActionsSticky": "Polaris-IndexTable__ScrollBarContainerSelectAllActionsSticky",
	"scrollBarContainerCondensed": "Polaris-IndexTable--scrollBarContainerCondensed",
	"scrollBarContainerHidden": "Polaris-IndexTable--scrollBarContainerHidden",
	"ScrollBar": "Polaris-IndexTable__ScrollBar",
	"disableTextSelection": "Polaris-IndexTable--disableTextSelection",
	"EmptySearchResultWrapper": "Polaris-IndexTable__EmptySearchResultWrapper",
	"condensedRow": "Polaris-IndexTable--condensedRow",
	"CondensedList": "Polaris-IndexTable__CondensedList",
	"HeaderWrapper": "Polaris-IndexTable__HeaderWrapper",
	"StickyTable-condensed": "Polaris-IndexTable__StickyTable--condensed",
	"StickyTableHeader-condensed": "Polaris-IndexTable__StickyTableHeader--condensed",
	"ScrollBarContent": "Polaris-IndexTable__ScrollBarContent"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/index-provider/types.js
var SelectionType = /* @__PURE__ */ function(SelectionType) {
	SelectionType["All"] = "all";
	SelectionType["Page"] = "page";
	SelectionType["Multi"] = "multi";
	SelectionType["Single"] = "single";
	SelectionType["Range"] = "range";
	return SelectionType;
}({});
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/index-provider/context.js
var IndexContext = /* @__PURE__ */ createContext(void 0);
var IndexSelectionChangeContext = /* @__PURE__ */ createContext(void 0);
var IndexRowContext = /* @__PURE__ */ createContext(void 0);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/index-provider/hooks.js
function useIndexSelectionChange() {
	const onSelectionChange = useContext(IndexSelectionChangeContext);
	if (!onSelectionChange) throw new Error(`Missing IndexProvider context`);
	return onSelectionChange;
}
function useIndexRow() {
	const indexRow = useContext(IndexRowContext);
	if (!indexRow) throw new Error(`Missing IndexProvider context`);
	return indexRow;
}
function useIndexValue() {
	const index = useContext(IndexContext);
	if (!index) throw new Error(`Missing IndexProvider context`);
	return index;
}
function useBulkSelectionData({ selectedItemsCount, itemCount, hasMoreItems, resourceName: passedResourceName, defaultPaginatedSelectAllText }) {
	const i18n = useI18n();
	const selectable = Boolean(selectedItemsCount);
	const selectMode = selectedItemsCount === "All" || selectedItemsCount > 0;
	const defaultResourceName = {
		singular: i18n.translate("Polaris.IndexProvider.defaultItemSingular"),
		plural: i18n.translate("Polaris.IndexProvider.defaultItemPlural")
	};
	const resourceName = passedResourceName ? passedResourceName : defaultResourceName;
	const paginatedSelectAllText = getPaginatedSelectAllText();
	const bulkActionsLabel = getBulkActionsLabel();
	const bulkActionsAccessibilityLabel = getBulkActionsAccessibilityLabel();
	let bulkSelectState = "indeterminate";
	if (!selectedItemsCount || selectedItemsCount === 0) bulkSelectState = void 0;
	else if (selectedItemsCount === "All" || selectedItemsCount === itemCount) bulkSelectState = true;
	return {
		paginatedSelectAllText,
		bulkActionsLabel,
		bulkActionsAccessibilityLabel,
		resourceName,
		selectMode,
		bulkSelectState,
		selectable
	};
	function getPaginatedSelectAllText() {
		if (!selectable || !hasMoreItems) return;
		if (selectedItemsCount === "All") {
			if (defaultPaginatedSelectAllText) return defaultPaginatedSelectAllText;
			return i18n.translate("Polaris.IndexProvider.allItemsSelected", {
				itemsLength: itemCount,
				resourceNamePlural: resourceName.plural.toLocaleLowerCase()
			});
		}
	}
	function getBulkActionsLabel() {
		const selectedItemsCountLabel = selectedItemsCount === "All" ? `${itemCount}+` : selectedItemsCount;
		return i18n.translate("Polaris.IndexProvider.selected", { selectedItemsCount: selectedItemsCountLabel });
	}
	function getBulkActionsAccessibilityLabel() {
		const totalItemsCount = itemCount;
		const allSelected = selectedItemsCount === totalItemsCount;
		if (totalItemsCount === 1 && allSelected) return i18n.translate("Polaris.IndexProvider.a11yCheckboxDeselectAllSingle", { resourceNameSingular: resourceName.singular });
		else if (totalItemsCount === 1) return i18n.translate("Polaris.IndexProvider.a11yCheckboxSelectAllSingle", { resourceNameSingular: resourceName.singular });
		else if (allSelected) return i18n.translate("Polaris.IndexProvider.a11yCheckboxDeselectAllMultiple", {
			itemsLength: itemCount,
			resourceNamePlural: resourceName.plural
		});
		else return i18n.translate("Polaris.IndexProvider.a11yCheckboxSelectAllMultiple", {
			itemsLength: itemCount,
			resourceNamePlural: resourceName.plural
		});
	}
}
function useHandleBulkSelection({ onSelectionChange = () => {} }) {
	const lastSelected = useRef(null);
	return useCallback((selectionType, toggleType, selection, sortOrder) => {
		const prevSelected = lastSelected.current;
		if (SelectionType.Multi && typeof sortOrder === "number") lastSelected.current = sortOrder;
		if (selectionType === SelectionType.Single || selectionType === SelectionType.Multi && (typeof prevSelected !== "number" || typeof sortOrder !== "number")) onSelectionChange(SelectionType.Single, toggleType, selection);
		else if (selectionType === SelectionType.Multi) onSelectionChange(selectionType, toggleType, [Math.min(prevSelected, sortOrder), Math.max(prevSelected, sortOrder)]);
		else if (selectionType === SelectionType.Page || selectionType === SelectionType.All) onSelectionChange(selectionType, toggleType);
		else if (selectionType === SelectionType.Range) onSelectionChange(SelectionType.Range, toggleType, selection);
	}, [onSelectionChange]);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexProvider/IndexProvider.js
function IndexProvider({ children, resourceName: passedResourceName, loading, onSelectionChange, selectedItemsCount = 0, itemCount, hasMoreItems, condensed, selectable: isSelectableIndex = true, paginatedSelectAllText: defaultPaginatedSelectAllText }) {
	const { paginatedSelectAllText, bulkActionsLabel, bulkActionsAccessibilityLabel, resourceName, selectMode, bulkSelectState } = useBulkSelectionData({
		selectedItemsCount,
		itemCount,
		hasMoreItems,
		resourceName: passedResourceName,
		defaultPaginatedSelectAllText
	});
	const handleSelectionChange = useHandleBulkSelection({ onSelectionChange });
	const contextValue = useMemo(() => ({
		itemCount,
		selectMode: selectMode && isSelectableIndex,
		selectable: isSelectableIndex,
		resourceName,
		loading,
		paginatedSelectAllText,
		hasMoreItems,
		bulkActionsLabel,
		bulkActionsAccessibilityLabel,
		bulkSelectState,
		selectedItemsCount,
		condensed
	}), [
		itemCount,
		selectMode,
		isSelectableIndex,
		resourceName,
		loading,
		paginatedSelectAllText,
		hasMoreItems,
		bulkActionsLabel,
		bulkActionsAccessibilityLabel,
		bulkSelectState,
		selectedItemsCount,
		condensed
	]);
	const rowContextValue = useMemo(() => ({
		selectable: isSelectableIndex,
		selectMode: selectMode && isSelectableIndex,
		condensed
	}), [
		condensed,
		selectMode,
		isSelectableIndex
	]);
	return /* @__PURE__ */ React.createElement(IndexContext.Provider, { value: contextValue }, /* @__PURE__ */ React.createElement(IndexRowContext.Provider, { value: rowContextValue }, /* @__PURE__ */ React.createElement(IndexSelectionChangeContext.Provider, { value: handleSelectionChange }, children)));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/index-table/context.js
var RowContext = /* @__PURE__ */ createContext({});
var RowHoveredContext = /* @__PURE__ */ createContext(void 0);
var scrollDefaultContext = {
	scrollableContainer: null,
	canScrollLeft: false,
	canScrollRight: false
};
var ScrollContext = /* @__PURE__ */ createContext(scrollDefaultContext);
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexTable/components/Cell/Cell.js
var Cell = /* @__PURE__ */ memo(function Cell({ children, className: customClassName, flush, colSpan, headers, scope, as = "td", id }) {
	const className = classNames(customClassName, styles$12.TableCell, flush && styles$12["TableCell-flush"]);
	return /* @__PURE__ */ React.createElement(as, {
		id,
		colSpan,
		headers,
		scope,
		className
	}, children);
});
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexTable/components/Checkbox/Checkbox.css.js
var styles$11 = { "Wrapper": "Polaris-IndexTable-Checkbox__Wrapper" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexTable/components/Checkbox/Checkbox.js
var Checkbox = /* @__PURE__ */ memo(function Checkbox({ accessibilityLabel }) {
	const i18n = useI18n();
	const { resourceName } = useIndexValue();
	const { itemId, selected, disabled, onInteraction } = useContext(RowContext);
	const label = accessibilityLabel ? accessibilityLabel : i18n.translate("Polaris.IndexTable.selectItem", { resourceName: resourceName.singular });
	return /* @__PURE__ */ React.createElement(CheckboxWrapper, null, /* @__PURE__ */ React.createElement("div", {
		className: styles$11.Wrapper,
		onClick: onInteraction,
		onKeyUp: noop
	}, /* @__PURE__ */ React.createElement(Checkbox$1, {
		id: `Select-${itemId}`,
		label,
		labelHidden: true,
		checked: selected,
		disabled
	})));
});
function CheckboxWrapper({ children }) {
	const { position } = useContext(RowContext);
	const checkboxNode = useRef(null);
	const handleResize = useCallback(debounce(() => {
		if (position !== 0 || !checkboxNode.current) return;
		const { width } = checkboxNode.current.getBoundingClientRect();
		setRootProperty("--pc-checkbox-offset", `${width}px`);
	}), [position]);
	useEffect(() => {
		handleResize();
	}, [handleResize]);
	useEffect(() => {
		if (!checkboxNode.current) return;
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [handleResize]);
	const checkboxClassName = classNames(styles$12.TableCell, styles$12["TableCell-first"]);
	return /* @__PURE__ */ React.createElement("td", {
		className: checkboxClassName,
		ref: checkboxNode
	}, children);
}
function noop() {}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexTable/components/Row/Row.js
var Row = /* @__PURE__ */ memo(function Row({ children, hideSelectable, selected, id, position, tone, disabled, selectionRange, rowType = "data", accessibilityLabel, onNavigation, onClick }) {
	const { selectable: tableIsSelectable, selectMode, condensed } = useIndexRow();
	const rowIsSelectable = tableIsSelectable && !hideSelectable;
	const onSelectionChange = useIndexSelectionChange();
	const { value: hovered, setTrue: setHoverIn, setFalse: setHoverOut } = useToggle(false);
	const handleInteraction = useCallback((event) => {
		event.stopPropagation();
		let selectionType = SelectionType.Single;
		if (disabled || !rowIsSelectable || "key" in event && event.key !== " " || !onSelectionChange) return;
		if (event.nativeEvent.shiftKey) selectionType = SelectionType.Multi;
		else if (selectionRange) selectionType = SelectionType.Range;
		onSelectionChange(selectionType, !selected, selectionRange ?? id, position);
	}, [
		id,
		onSelectionChange,
		selected,
		selectionRange,
		position,
		disabled,
		rowIsSelectable
	]);
	const contextValue = useMemo(() => ({
		itemId: id,
		selected,
		position,
		onInteraction: handleInteraction,
		disabled
	}), [
		id,
		selected,
		disabled,
		position,
		handleInteraction
	]);
	const primaryLinkElement = useRef(null);
	const isNavigating = useRef(false);
	const tableRowRef = useRef(null);
	const tableRowCallbackRef = useCallback((node) => {
		tableRowRef.current = node;
		const el = node?.querySelector("[data-primary-link]");
		if (el) primaryLinkElement.current = el;
	}, []);
	const rowClassName = classNames(styles$12.TableRow, rowType === "subheader" && styles$12["TableRow-subheader"], rowType === "child" && styles$12["TableRow-child"], rowIsSelectable && condensed && styles$12.condensedRow, selected && styles$12["TableRow-selected"], hovered && !condensed && styles$12["TableRow-hovered"], disabled && styles$12["TableRow-disabled"], tone && styles$12[variationName("tone", tone)], !rowIsSelectable && !onClick && !primaryLinkElement.current && styles$12["TableRow-unclickable"]);
	let handleRowClick;
	if (!disabled && rowIsSelectable || onClick || primaryLinkElement.current) handleRowClick = (event) => {
		if (rowType === "subheader") return;
		if (!tableRowRef.current || isNavigating.current) return;
		event.stopPropagation();
		event.preventDefault();
		if (onClick) {
			onClick();
			return;
		}
		if (primaryLinkElement.current && !selectMode) {
			isNavigating.current = true;
			const { ctrlKey, metaKey } = event.nativeEvent;
			if (onNavigation) onNavigation(id);
			if ((ctrlKey || metaKey) && primaryLinkElement.current instanceof HTMLAnchorElement) {
				isNavigating.current = false;
				window.open(primaryLinkElement.current.href, "_blank");
				return;
			}
			primaryLinkElement.current.dispatchEvent(new MouseEvent(event.type, event.nativeEvent));
		} else {
			isNavigating.current = false;
			handleInteraction(event);
		}
	};
	const RowWrapper = condensed ? "li" : "tr";
	const checkboxMarkup = hideSelectable ? /* @__PURE__ */ React.createElement(Cell, null) : /* @__PURE__ */ React.createElement(Checkbox, { accessibilityLabel });
	return /* @__PURE__ */ React.createElement(RowContext.Provider, { value: contextValue }, /* @__PURE__ */ React.createElement(RowHoveredContext.Provider, { value: hovered }, /* @__PURE__ */ React.createElement(RowWrapper, {
		key: id,
		id,
		className: rowClassName,
		onMouseEnter: setHoverIn,
		onMouseLeave: setHoverOut,
		onClick: handleRowClick,
		ref: tableRowCallbackRef
	}, tableIsSelectable ? checkboxMarkup : null, children)));
});
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexTable/utilities/utilities.js
function getTableHeadingsBySelector(wrapperElement, selector) {
	return wrapperElement ? Array.from(wrapperElement.querySelectorAll(selector)) : [];
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexTable/components/ScrollContainer/ScrollContainer.css.js
var styles$10 = { "ScrollContainer": "Polaris-IndexTable-ScrollContainer" };
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexTable/components/ScrollContainer/ScrollContainer.js
function ScrollContainer({ children, scrollableContainerRef, onScroll }) {
	useEffect(() => {
		if (!scrollableContainerRef.current) return;
		scrollableContainerRef.current.dispatchEvent(new Event("scroll"));
	}, [scrollableContainerRef]);
	const [containerScroll, setContainerScroll] = useState(scrollDefaultContext);
	const handleScroll = useCallback(debounce(() => {
		if (!scrollableContainerRef.current) return;
		const availableScrollAmount = scrollableContainerRef.current.scrollWidth - scrollableContainerRef.current.offsetWidth;
		const canScrollLeft = scrollableContainerRef.current.scrollLeft > 0;
		const canScrollRight = scrollableContainerRef.current.scrollLeft < availableScrollAmount;
		onScroll(canScrollLeft, canScrollRight);
		setContainerScroll({
			scrollableContainer: scrollableContainerRef.current,
			canScrollLeft,
			canScrollRight
		});
	}, 40, {
		trailing: true,
		leading: true,
		maxWait: 40
	}), [onScroll, scrollableContainerRef]);
	return /* @__PURE__ */ React.createElement(ScrollContext.Provider, { value: containerScroll }, /* @__PURE__ */ React.createElement("div", {
		className: styles$10.ScrollContainer,
		ref: scrollableContainerRef,
		onScroll: handleScroll
	}, children));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/IndexTable/IndexTable.js
var SCROLL_BAR_PADDING = 16;
var SCROLL_BAR_DEBOUNCE_PERIOD = 300;
function IndexTableBase({ headings, bulkActions = [], promotedBulkActions = [], children, emptyState, sort, paginatedSelectAllActionText, lastColumnSticky = false, sortable, sortDirection, defaultSortDirection = "descending", sortColumnIndex, onSort, sortToggleLabels, hasZebraStriping, pagination, ...restProps }) {
	const { loading, bulkSelectState, resourceName, bulkActionsAccessibilityLabel, selectMode, selectable = restProps.selectable, paginatedSelectAllText, itemCount, hasMoreItems, selectedItemsCount, condensed } = useIndexValue();
	const handleSelectionChange = useIndexSelectionChange();
	const i18n = useI18n();
	const { value: hasMoreLeftColumns, toggle: toggleHasMoreLeftColumns } = useToggle(false);
	const tablePosition = useRef({
		top: 0,
		left: 0
	});
	const tableHeadingRects = useRef([]);
	const scrollableContainerElement = useRef(null);
	const tableElement = useRef(null);
	const tableBodyElement = useRef(null);
	const condensedListElement = useRef(null);
	const [tableInitialized, setTableInitialized] = useState(false);
	const [stickyWrapper, setStickyWrapper] = useState(null);
	const [hideScrollContainer, setHideScrollContainer] = useState(true);
	const tableHeadings = useRef([]);
	const stickyTableHeadings = useRef([]);
	const stickyHeaderWrapperElement = useRef(null);
	const firstStickyHeaderElement = useRef(null);
	const stickyHeaderElement = useRef(null);
	const scrollBarElement = useRef(null);
	const scrollContainerElement = useRef(null);
	const scrollingWithBar = useRef(false);
	const scrollingContainer = useRef(false);
	const lastSortedColumnIndex = useRef(sortColumnIndex);
	const renderAfterSelectEvent = useRef(false);
	const lastSelectedItemsCount = useRef(0);
	const hasSelected = useRef(false);
	if (selectedItemsCount !== lastSelectedItemsCount.current) {
		renderAfterSelectEvent.current = true;
		lastSelectedItemsCount.current = selectedItemsCount;
	}
	if (!hasSelected.current && selectedItemsCount !== 0) hasSelected.current = true;
	const tableBodyRef = useCallback((node) => {
		if (node !== null && !tableInitialized) setTableInitialized(true);
		tableBodyElement.current = node;
	}, [tableInitialized]);
	const handleSelectAllItemsInStore = useCallback(() => {
		handleSelectionChange(selectedItemsCount === "All" ? SelectionType.Page : SelectionType.All, true);
	}, [handleSelectionChange, selectedItemsCount]);
	const resizeTableHeadings = useMemo(() => debounce(() => {
		if (!tableElement.current || !scrollableContainerElement.current) return;
		const boundingRect = scrollableContainerElement.current.getBoundingClientRect();
		tablePosition.current = {
			top: boundingRect.top,
			left: boundingRect.left
		};
		tableHeadingRects.current = tableHeadings.current.map((heading) => ({
			offsetWidth: heading.offsetWidth || 0,
			offsetLeft: heading.offsetLeft || 0
		}));
		if (tableHeadings.current.length === 0) return;
		if (selectable && tableHeadings.current.length > 1) {
			tableHeadings.current[1].style.left = `${tableHeadingRects.current[0].offsetWidth}px`;
			if (stickyTableHeadings.current?.length) stickyTableHeadings.current[1].style.left = `${tableHeadingRects.current[0].offsetWidth}px`;
		}
		if (stickyTableHeadings.current?.length) stickyTableHeadings.current.forEach((heading, index) => {
			heading.style.minWidth = `${tableHeadingRects.current[index]?.offsetWidth || 0}px`;
		});
	}), [selectable]);
	const resizeTableScrollBar = useCallback(() => {
		if (scrollBarElement.current && tableElement.current && tableInitialized) {
			scrollBarElement.current.style.setProperty("--pc-index-table-scroll-bar-content-width", `${tableElement.current.offsetWidth - SCROLL_BAR_PADDING}px`);
			setHideScrollContainer(scrollContainerElement.current?.offsetWidth === tableElement.current?.offsetWidth);
		}
	}, [tableInitialized]);
	const debounceResizeTableScrollbar = useCallback(debounce(resizeTableScrollBar, SCROLL_BAR_DEBOUNCE_PERIOD, { trailing: true }), [resizeTableScrollBar]);
	const [canScrollRight, setCanScrollRight] = useState(true);
	const handleCanScrollRight = useCallback(debounce(() => {
		if (!lastColumnSticky || !tableElement.current || !scrollableContainerElement.current) return;
		const tableRect = tableElement.current.getBoundingClientRect();
		const scrollableRect = scrollableContainerElement.current.getBoundingClientRect();
		setCanScrollRight(tableRect.width > scrollableRect.width);
	}), [lastColumnSticky]);
	useEffect(() => {
		handleCanScrollRight();
	}, [handleCanScrollRight]);
	const [canFitStickyColumn, setCanFitStickyColumn] = useState(true);
	const handleCanFitStickyColumn = useCallback(() => {
		if (!scrollableContainerElement.current || !tableHeadings.current.length) return;
		const scrollableRect = scrollableContainerElement.current.getBoundingClientRect();
		const checkboxColumnWidth = selectable ? tableHeadings.current[0].getBoundingClientRect().width : 0;
		const firstStickyColumnWidth = tableHeadings.current[selectable ? 1 : 0].getBoundingClientRect().width;
		const lastColumnIsNotTheFirst = selectable ? tableHeadings.current.length > 2 : 1;
		const lastStickyColumnWidth = lastColumnSticky && lastColumnIsNotTheFirst ? tableHeadings.current[tableHeadings.current.length - 1].getBoundingClientRect().width : 0;
		setCanFitStickyColumn(scrollableRect.width > firstStickyColumnWidth + checkboxColumnWidth + lastStickyColumnWidth + 100);
	}, [lastColumnSticky, selectable]);
	useEffect(() => {
		if (tableInitialized) handleCanFitStickyColumn();
	}, [handleCanFitStickyColumn, tableInitialized]);
	const handleResize = useCallback(() => {
		scrollBarElement.current?.style.setProperty("--pc-index-table-scroll-bar-content-width", `0px`);
		resizeTableHeadings();
		debounceResizeTableScrollbar();
		handleCanScrollRight();
		handleCanFitStickyColumn();
	}, [
		resizeTableHeadings,
		debounceResizeTableScrollbar,
		handleCanScrollRight,
		handleCanFitStickyColumn
	]);
	const handleScrollContainerScroll = useCallback((canScrollLeft, canScrollRight) => {
		if (!scrollableContainerElement.current || !scrollBarElement.current) return;
		if (!scrollingWithBar.current) {
			scrollingContainer.current = true;
			scrollBarElement.current.scrollLeft = scrollableContainerElement.current.scrollLeft;
		}
		scrollingWithBar.current = false;
		if (stickyHeaderElement.current) stickyHeaderElement.current.scrollLeft = scrollableContainerElement.current.scrollLeft;
		if (canScrollLeft && !hasMoreLeftColumns || !canScrollLeft && hasMoreLeftColumns) toggleHasMoreLeftColumns();
		setCanScrollRight(canScrollRight);
	}, [hasMoreLeftColumns, toggleHasMoreLeftColumns]);
	const handleScrollBarScroll = useCallback(() => {
		if (!scrollableContainerElement.current || !scrollBarElement.current) return;
		if (!scrollingContainer.current) {
			scrollingWithBar.current = true;
			scrollableContainerElement.current.scrollLeft = scrollBarElement.current.scrollLeft;
		}
		scrollingContainer.current = false;
	}, []);
	useIsomorphicLayoutEffect(() => {
		tableHeadings.current = getTableHeadingsBySelector(tableElement.current, "[data-index-table-heading]");
		stickyTableHeadings.current = getTableHeadingsBySelector(stickyHeaderWrapperElement.current, "[data-index-table-sticky-heading]");
		resizeTableHeadings();
	}, [
		headings,
		resizeTableHeadings,
		firstStickyHeaderElement,
		tableInitialized
	]);
	useEffect(() => {
		resizeTableScrollBar();
		setStickyWrapper(condensed ? condensedListElement.current : tableElement.current);
	}, [
		tableInitialized,
		resizeTableScrollBar,
		condensed
	]);
	const headingsMarkup = headings.map((heading, index) => renderHeading(heading, index, "th", { "data-index-table-heading": true }, heading.id));
	const stickyHeadingsMarkup = headings.map((heading, index) => renderHeading(heading, index, "div", { "data-index-table-sticky-heading": true }));
	const [selectedItemsCountValue, setSelectedItemsCountValue] = useState(selectedItemsCount === "All" ? `${itemCount}+` : selectedItemsCount);
	useEffect(() => {
		if (selectedItemsCount === "All" || selectedItemsCount > 0) setSelectedItemsCountValue(selectedItemsCount === "All" ? `${itemCount}+` : selectedItemsCount);
	}, [selectedItemsCount, itemCount]);
	const selectAllActionsLabel = i18n.translate("Polaris.IndexTable.selected", { selectedItemsCount: selectedItemsCountValue });
	const handleTogglePage = useCallback(() => {
		handleSelectionChange(SelectionType.Page, Boolean(!bulkSelectState || bulkSelectState === "indeterminate"));
	}, [bulkSelectState, handleSelectionChange]);
	const paginatedSelectAllAction = getPaginatedSelectAllAction();
	const loadingMarkup = /* @__PURE__ */ React.createElement("div", { className: classNames(styles$12.LoadingPanel, loading && styles$12.LoadingPanelEntered) }, /* @__PURE__ */ React.createElement("div", { className: styles$12.LoadingPanelRow }, /* @__PURE__ */ React.createElement(Spinner$1, { size: "small" }), /* @__PURE__ */ React.createElement("span", { className: styles$12.LoadingPanelText }, i18n.translate("Polaris.IndexTable.resourceLoadingAccessibilityLabel", { resourceNamePlural: resourceName.plural.toLocaleLowerCase() }))));
	const stickyTableClassNames = classNames(styles$12.StickyTable, hasMoreLeftColumns && styles$12["StickyTable-scrolling"], condensed && styles$12["StickyTable-condensed"]);
	const shouldShowActions = !condensed || selectedItemsCount;
	const promotedActions = shouldShowActions ? promotedBulkActions : [];
	const actions = shouldShowActions ? bulkActions : [];
	const stickyHeaderMarkup = /* @__PURE__ */ React.createElement("div", {
		className: stickyTableClassNames,
		role: "presentation"
	}, /* @__PURE__ */ React.createElement(Sticky, { boundingElement: stickyWrapper }, (isSticky) => {
		const stickyHeaderClassNames = classNames(styles$12.StickyTableHeader, isSticky && styles$12["StickyTableHeader-isSticky"], canFitStickyColumn && styles$12["StickyTableHeader-sticky"], hasMoreLeftColumns && styles$12["StickyTableHeader-scrolling"], canFitStickyColumn && lastColumnSticky && styles$12["StickyTableHeader-sticky-last"], canFitStickyColumn && lastColumnSticky && canScrollRight && styles$12["StickyTableHeader-sticky-scrolling"]);
		const bulkActionsClassName = classNames(styles$12.BulkActionsWrapper, selectMode && styles$12.BulkActionsWrapperVisible, condensed && styles$12["StickyTableHeader-condensed"], isSticky && styles$12["StickyTableHeader-isSticky"]);
		const bulkActionsMarkup = shouldShowActions && !condensed ? /* @__PURE__ */ React.createElement("div", { className: bulkActionsClassName }, /* @__PURE__ */ React.createElement(BulkActions, {
			selectMode,
			onToggleAll: handleTogglePage,
			paginatedSelectAllText,
			paginatedSelectAllAction,
			accessibilityLabel: bulkActionsAccessibilityLabel,
			selected: bulkSelectState,
			promotedActions,
			actions,
			onSelectModeToggle: condensed ? handleSelectModeToggle : void 0,
			label: selectAllActionsLabel,
			buttonSize: "micro"
		})) : null;
		const headerMarkup = condensed ? /* @__PURE__ */ React.createElement("div", { className: classNames(styles$12.HeaderWrapper, (!selectable || condensed) && styles$12.unselectable) }, loadingMarkup, sort) : /* @__PURE__ */ React.createElement("div", {
			className: stickyHeaderClassNames,
			ref: stickyHeaderWrapperElement
		}, loadingMarkup, /* @__PURE__ */ React.createElement("div", {
			className: styles$12.StickyTableHeadings,
			ref: stickyHeaderElement
		}, stickyHeadingsMarkup));
		return /* @__PURE__ */ React.createElement(React.Fragment, null, headerMarkup, bulkActionsMarkup);
	}));
	const scrollBarWrapperClassNames = classNames(styles$12.ScrollBarContainer, pagination && styles$12.ScrollBarContainerWithPagination, condensed && styles$12.scrollBarContainerCondensed, hideScrollContainer && styles$12.scrollBarContainerHidden);
	const scrollBarClassNames = classNames(tableElement.current && tableInitialized && styles$12.ScrollBarContent);
	const scrollBarMarkup = itemCount > 0 ? /* @__PURE__ */ React.createElement(AfterInitialMount, { onMount: resizeTableScrollBar }, /* @__PURE__ */ React.createElement("div", {
		className: scrollBarWrapperClassNames,
		ref: scrollContainerElement
	}, /* @__PURE__ */ React.createElement("div", {
		onScroll: handleScrollBarScroll,
		className: styles$12.ScrollBar,
		ref: scrollBarElement
	}, /* @__PURE__ */ React.createElement("div", { className: scrollBarClassNames })))) : null;
	const isSortable = sortable?.some((value) => value);
	const tableClassNames = classNames(styles$12.Table, hasMoreLeftColumns && styles$12["Table-scrolling"], selectMode && styles$12.disableTextSelection, !selectable && styles$12["Table-unselectable"], canFitStickyColumn && styles$12["Table-sticky"], isSortable && styles$12["Table-sortable"], canFitStickyColumn && lastColumnSticky && styles$12["Table-sticky-last"], canFitStickyColumn && lastColumnSticky && canScrollRight && styles$12["Table-sticky-scrolling"], hasZebraStriping && styles$12.ZebraStriping);
	const emptyStateMarkup = emptyState ? emptyState : /* @__PURE__ */ React.createElement(EmptySearchResult, {
		title: i18n.translate("Polaris.IndexTable.emptySearchTitle", { resourceNamePlural: resourceName.plural }),
		description: i18n.translate("Polaris.IndexTable.emptySearchDescription"),
		withIllustration: true
	});
	const sharedMarkup = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(EventListener, {
		event: "resize",
		handler: handleResize
	}), stickyHeaderMarkup);
	const condensedClassNames = classNames(styles$12.CondensedList, hasZebraStriping && styles$12.ZebraStriping);
	const bodyMarkup = condensed ? /* @__PURE__ */ React.createElement(React.Fragment, null, sharedMarkup, /* @__PURE__ */ React.createElement("ul", {
		"data-selectmode": Boolean(selectMode),
		className: condensedClassNames,
		ref: condensedListElement
	}, children)) : /* @__PURE__ */ React.createElement(React.Fragment, null, sharedMarkup, /* @__PURE__ */ React.createElement(ScrollContainer, {
		scrollableContainerRef: scrollableContainerElement,
		onScroll: handleScrollContainerScroll
	}, /* @__PURE__ */ React.createElement("table", {
		ref: tableElement,
		className: tableClassNames
	}, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: styles$12.HeadingRow }, headingsMarkup)), /* @__PURE__ */ React.createElement("tbody", { ref: tableBodyRef }, children))));
	const tableContentMarkup = itemCount > 0 ? bodyMarkup : /* @__PURE__ */ React.createElement("div", { className: styles$12.EmptySearchResultWrapper }, emptyStateMarkup);
	const paginationMarkup = pagination ? /* @__PURE__ */ React.createElement("div", { className: styles$12.PaginationWrapper }, /* @__PURE__ */ React.createElement(Pagination, Object.assign({ type: "table" }, pagination))) : null;
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: styles$12.IndexTable }, /* @__PURE__ */ React.createElement("div", { className: styles$12.IndexTableWrapper }, !condensed && loadingMarkup, tableContentMarkup, scrollBarMarkup, paginationMarkup)));
	function renderHeading(heading, index, Tag, tagProps, id) {
		const isSecond = index === 0;
		const isLast = index === headings.length - 1;
		const hasSortable = sortable?.some((value) => value === true);
		const headingAlignment = heading.alignment || "start";
		const headingContentClassName = classNames(styles$12.TableHeading, headingAlignment === "center" && styles$12["TableHeading-align-center"], headingAlignment === "end" && styles$12["TableHeading-align-end"], hasSortable && styles$12["TableHeading-sortable"], isSecond && styles$12["TableHeading-second"], isLast && !heading.hidden && styles$12["TableHeading-last"], !selectable && styles$12["TableHeading-unselectable"], heading.flush && styles$12["TableHeading-flush"]);
		const stickyPositioningStyle = selectable !== false && isSecond && tableHeadingRects.current && tableHeadingRects.current.length > 0 ? { left: tableHeadingRects.current[0].offsetWidth } : void 0;
		const headingContent = /* @__PURE__ */ React.createElement(Tag, Object.assign({
			id,
			className: headingContentClassName,
			key: getHeadingKey(heading),
			style: stickyPositioningStyle
		}, tagProps), renderHeadingContent(heading, index));
		if (index !== 0 || !selectable) return headingContent;
		const checkboxClassName = classNames(styles$12.TableHeading, hasSortable && styles$12["TableHeading-sortable"], index === 0 && styles$12["TableHeading-first"]);
		return [/* @__PURE__ */ React.createElement(Tag, Object.assign({
			className: checkboxClassName,
			key: `${heading}-${index}`
		}, tagProps), renderCheckboxContent()), headingContent];
	}
	function renderCheckboxContent() {
		return /* @__PURE__ */ React.createElement("div", { className: styles$12.ColumnHeaderCheckboxWrapper }, /* @__PURE__ */ React.createElement(Checkbox$1, {
			label: i18n.translate("Polaris.IndexTable.selectAllLabel", { resourceNamePlural: resourceName.plural }),
			labelHidden: true,
			onChange: handleSelectPage,
			checked: bulkSelectState
		}));
	}
	function handleSortHeadingClick(index, direction) {
		renderAfterSelectEvent.current = false;
		hasSelected.current = false;
		lastSortedColumnIndex.current = sortColumnIndex;
		onSort?.(index, direction);
	}
	function renderHeadingContent(heading, index) {
		let headingContent;
		const defaultTooltipProps = {
			width: heading.tooltipWidth ?? "default",
			activatorWrapper: "div",
			dismissOnMouseOut: true,
			persistOnClick: heading.tooltipPersistsOnClick
		};
		const defaultHeaderTooltipProps = {
			...defaultTooltipProps,
			padding: "400",
			borderRadius: "200",
			content: heading.tooltipContent,
			preferredPosition: "above"
		};
		const headingTitle = /* @__PURE__ */ React.createElement(Text, {
			as: "span",
			variant: "bodySm",
			fontWeight: "medium",
			visuallyHidden: heading.hidden
		}, heading.title);
		if (heading.new) headingContent = /* @__PURE__ */ React.createElement(LegacyStack, {
			wrap: false,
			alignment: "center"
		}, headingTitle, /* @__PURE__ */ React.createElement(Badge, { tone: "new" }, i18n.translate("Polaris.IndexTable.onboardingBadgeText")));
		else headingContent = headingTitle;
		const style = { "--pc-index-table-heading-extra-padding-right": heading.paddingBlockEnd ? `var(--p-space-${heading.paddingBlockEnd})` : "0" };
		if (sortable?.[index]) {
			const isCurrentlySorted = index === sortColumnIndex;
			const isPreviouslySorted = !isCurrentlySorted && index === lastSortedColumnIndex.current;
			const isRenderAfterSelectEvent = renderAfterSelectEvent.current || !hasSelected.current && selectedItemsCount !== 0;
			const isAscending = sortDirection === "ascending";
			let newDirection = heading.defaultSortDirection ?? defaultSortDirection;
			let SourceComponent = newDirection === "ascending" ? SvgSortAscendingIcon : SvgSortDescendingIcon;
			if (isCurrentlySorted) {
				newDirection = isAscending ? "descending" : "ascending";
				SourceComponent = sortDirection === "ascending" ? SvgSortAscendingIcon : SvgSortDescendingIcon;
			}
			const iconMarkup = /* @__PURE__ */ React.createElement("span", { className: classNames(styles$12.TableHeadingSortIcon, heading?.alignment === "end" && styles$12["TableHeadingSortIcon-heading-align-end"], isCurrentlySorted && styles$12["TableHeadingSortIcon-visible"]) }, /* @__PURE__ */ React.createElement(SourceComponent, {
				focusable: "false",
				"aria-hidden": "true",
				className: styles$12.TableHeadingSortSvg
			}));
			const defaultSortButtonProps = {
				onClick: () => handleSortHeadingClick(index, newDirection),
				className: classNames(styles$12.TableHeadingSortButton, !isCurrentlySorted && heading?.alignment === "end" && styles$12["TableHeadingSortButton-heading-align-end"], isCurrentlySorted && heading?.alignment === "end" && styles$12["TableHeadingSortButton-heading-align-end-currently-sorted"], isPreviouslySorted && !isRenderAfterSelectEvent && heading?.alignment === "end" && styles$12["TableHeadingSortButton-heading-align-end-previously-sorted"]),
				tabIndex: selectMode ? -1 : 0
			};
			const sortMarkup = /* @__PURE__ */ React.createElement(UnstyledButton, defaultSortButtonProps, iconMarkup, /* @__PURE__ */ React.createElement("span", { className: classNames(sortToggleLabels && selectMode && heading.tooltipContent && styles$12.TableHeadingTooltipUnderlinePlaceholder) }, headingContent));
			if (!sortToggleLabels || selectMode) return /* @__PURE__ */ React.createElement("div", { className: styles$12.SortableTableHeadingWithCustomMarkup }, sortMarkup);
			const tooltipDirection = isCurrentlySorted ? sortDirection : newDirection;
			const sortTooltipContent = sortToggleLabels[index][tooltipDirection];
			if (!heading.tooltipContent) return /* @__PURE__ */ React.createElement("div", {
				style,
				className: classNames(heading.paddingBlockEnd && styles$12["TableHeading-extra-padding-right"])
			}, /* @__PURE__ */ React.createElement(Tooltip, Object.assign({}, defaultTooltipProps, {
				content: sortTooltipContent,
				preferredPosition: "above"
			}), sortMarkup));
			if (heading.tooltipContent) return /* @__PURE__ */ React.createElement("div", {
				className: classNames(styles$12.SortableTableHeadingWithCustomMarkup, heading.paddingBlockEnd && styles$12["TableHeading-extra-padding-right"]),
				style
			}, /* @__PURE__ */ React.createElement(UnstyledButton, defaultSortButtonProps, /* @__PURE__ */ React.createElement(Tooltip, defaultHeaderTooltipProps, /* @__PURE__ */ React.createElement("span", { className: styles$12.TableHeadingUnderline }, headingContent)), /* @__PURE__ */ React.createElement(Tooltip, Object.assign({}, defaultTooltipProps, {
				content: sortTooltipContent,
				preferredPosition: "above"
			}), iconMarkup)));
		}
		if (heading.tooltipContent) return /* @__PURE__ */ React.createElement("div", {
			style,
			className: classNames(heading.paddingBlockEnd && styles$12["TableHeading-extra-padding-right"])
		}, /* @__PURE__ */ React.createElement(Tooltip, Object.assign({}, defaultHeaderTooltipProps, { activatorWrapper: "span" }), /* @__PURE__ */ React.createElement("span", { className: classNames(styles$12.TableHeadingUnderline, styles$12.SortableTableHeaderWrapper) }, headingContent)));
		return /* @__PURE__ */ React.createElement("div", {
			style,
			className: classNames(heading.paddingBlockEnd && styles$12["TableHeading-extra-padding-right"])
		}, headingContent);
	}
	function handleSelectPage(checked) {
		handleSelectionChange(SelectionType.Page, checked);
	}
	function getPaginatedSelectAllAction() {
		if (!selectable || !hasMoreItems) return;
		const customActionText = paginatedSelectAllActionText ?? i18n.translate("Polaris.IndexTable.selectAllItems", {
			itemsLength: itemCount,
			resourceNamePlural: resourceName.plural.toLocaleLowerCase()
		});
		return {
			content: selectedItemsCount === "All" ? i18n.translate("Polaris.IndexTable.undo") : customActionText,
			onAction: handleSelectAllItemsInStore
		};
	}
	function handleSelectModeToggle() {
		handleSelectionChange(SelectionType.All, false);
	}
}
function getHeadingKey(heading) {
	if (heading.id) return heading.id;
	else if (typeof heading.title === "string") return heading.title;
	return "";
}
function IndexTable({ children, selectable = true, itemCount, selectedItemsCount = 0, resourceName: passedResourceName, loading, hasMoreItems, condensed, onSelectionChange, paginatedSelectAllText, ...indexTableBaseProps }) {
	return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(IndexProvider, {
		selectable: selectable && !condensed,
		itemCount,
		selectedItemsCount,
		resourceName: passedResourceName,
		loading,
		hasMoreItems,
		condensed,
		onSelectionChange,
		paginatedSelectAllText
	}, /* @__PURE__ */ React.createElement(IndexTableBase, indexTableBaseProps, children)));
}
IndexTable.Cell = Cell;
IndexTable.Row = Row;
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Layout/Layout.css.js
var styles$9 = {
	"Layout": "Polaris-Layout",
	"Section": "Polaris-Layout__Section",
	"Section-fullWidth": "Polaris-Layout__Section--fullWidth",
	"Section-oneHalf": "Polaris-Layout__Section--oneHalf",
	"Section-oneThird": "Polaris-Layout__Section--oneThird",
	"AnnotatedSection": "Polaris-Layout__AnnotatedSection",
	"AnnotationWrapper": "Polaris-Layout__AnnotationWrapper",
	"AnnotationContent": "Polaris-Layout__AnnotationContent",
	"Annotation": "Polaris-Layout__Annotation"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/TextContainer/TextContainer.css.js
var styles$8 = {
	"TextContainer": "Polaris-TextContainer",
	"spacingTight": "Polaris-TextContainer--spacingTight",
	"spacingLoose": "Polaris-TextContainer--spacingLoose"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/TextContainer/TextContainer.js
/** @deprecated Use BlockStack instead */
function TextContainer({ spacing, children }) {
	const className = classNames(styles$8.TextContainer, spacing && styles$8[variationName("spacing", spacing)]);
	return /* @__PURE__ */ React.createElement("div", { className }, children);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Layout/components/AnnotatedSection/AnnotatedSection.js
function AnnotatedSection({ children, title, description, id }) {
	const descriptionMarkup = typeof description === "string" ? /* @__PURE__ */ React.createElement(Text, {
		as: "p",
		variant: "bodyMd"
	}, description) : description;
	return /* @__PURE__ */ React.createElement("div", { className: styles$9.AnnotatedSection }, /* @__PURE__ */ React.createElement("div", { className: styles$9.AnnotationWrapper }, /* @__PURE__ */ React.createElement("div", { className: styles$9.Annotation }, /* @__PURE__ */ React.createElement(TextContainer, { spacing: "tight" }, /* @__PURE__ */ React.createElement(Text, {
		id,
		variant: "headingMd",
		as: "h2"
	}, title), descriptionMarkup && /* @__PURE__ */ React.createElement(Box, { color: "text-secondary" }, descriptionMarkup))), /* @__PURE__ */ React.createElement("div", { className: styles$9.AnnotationContent }, children)));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Layout/components/Section/Section.js
function Section({ children, variant }) {
	const className = classNames(styles$9.Section, styles$9[`Section-${variant}`]);
	return /* @__PURE__ */ React.createElement("div", { className }, children);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Layout/Layout.js
var Layout = function Layout({ sectioned, children }) {
	const content = sectioned ? /* @__PURE__ */ React.createElement(Section, null, children) : children;
	return /* @__PURE__ */ React.createElement("div", { className: styles$9.Layout }, content);
};
Layout.AnnotatedSection = AnnotatedSection;
Layout.Section = Section;
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Link/Link.css.js
var styles$7 = {
	"Link": "Polaris-Link",
	"monochrome": "Polaris-Link--monochrome",
	"removeUnderline": "Polaris-Link--removeUnderline"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Link/Link.js
function Link$1({ url, children, onClick, external, target, id, monochrome, removeUnderline, accessibilityLabel, dataPrimaryLink }) {
	return /* @__PURE__ */ React.createElement(BannerContext.Consumer, null, (BannerContext) => {
		const shouldBeMonochrome = monochrome || BannerContext;
		const className = classNames(styles$7.Link, shouldBeMonochrome && styles$7.monochrome, removeUnderline && styles$7.removeUnderline);
		return url ? /* @__PURE__ */ React.createElement(UnstyledLink, {
			onClick,
			className,
			url,
			external,
			target,
			id,
			"aria-label": accessibilityLabel,
			"data-primary-link": dataPrimaryLink
		}, children) : /* @__PURE__ */ React.createElement("button", {
			type: "button",
			onClick,
			className,
			id,
			"aria-label": accessibilityLabel,
			"data-primary-link": dataPrimaryLink
		}, children);
	});
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/List/List.css.js
var styles$6 = {
	"List": "Polaris-List",
	"typeNumber": "Polaris-List--typeNumber",
	"Item": "Polaris-List__Item",
	"spacingLoose": "Polaris-List--spacingLoose"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/List/components/Item/Item.js
function Item({ children }) {
	return /* @__PURE__ */ React.createElement("li", { className: styles$6.Item }, children);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/List/List.js
var List = function List({ children, gap = "loose", type = "bullet" }) {
	const className = classNames(styles$6.List, gap && styles$6[variationName("spacing", gap)], type && styles$6[variationName("type", type)]);
	const ListElement = type === "bullet" ? "ul" : "ol";
	return /* @__PURE__ */ React.createElement(ListElement, { className }, children);
};
List.Item = Item;
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/is-interface.js
function isInterface(x) {
	return !/* @__PURE__ */ isValidElement(x) && x !== void 0;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/utilities/is-react-element.js
function isReactElement(x) {
	return /* @__PURE__ */ isValidElement(x) && x !== void 0;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Page/Page.css.js
var styles$5 = {
	"Page": "Polaris-Page",
	"fullWidth": "Polaris-Page--fullWidth",
	"narrowWidth": "Polaris-Page--narrowWidth",
	"Content": "Polaris-Page__Content"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Page/components/Header/Header.css.js
var styles$4 = {
	"TitleWrapper": "Polaris-Page-Header__TitleWrapper",
	"TitleWrapperExpand": "Polaris-Page-Header__TitleWrapperExpand",
	"BreadcrumbWrapper": "Polaris-Page-Header__BreadcrumbWrapper",
	"PaginationWrapper": "Polaris-Page-Header__PaginationWrapper",
	"PrimaryActionWrapper": "Polaris-Page-Header__PrimaryActionWrapper",
	"Row": "Polaris-Page-Header__Row",
	"mobileView": "Polaris-Page-Header--mobileView",
	"RightAlign": "Polaris-Page-Header__RightAlign",
	"noBreadcrumbs": "Polaris-Page-Header--noBreadcrumbs",
	"AdditionalMetaData": "Polaris-Page-Header__AdditionalMetaData",
	"Actions": "Polaris-Page-Header__Actions",
	"longTitle": "Polaris-Page-Header--longTitle",
	"mediumTitle": "Polaris-Page-Header--mediumTitle",
	"isSingleRow": "Polaris-Page-Header--isSingleRow"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Page/components/Header/components/Title/Title.css.js
var styles$3 = {
	"Title": "Polaris-Header-Title",
	"TitleWithSubtitle": "Polaris-Header-Title__TitleWithSubtitle",
	"TitleWrapper": "Polaris-Header-Title__TitleWrapper",
	"SubTitle": "Polaris-Header-Title__SubTitle",
	"SubtitleCompact": "Polaris-Header-Title__SubtitleCompact",
	"SubtitleMaxWidth": "Polaris-Header-Title__SubtitleMaxWidth"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Page/components/Header/components/Title/Title.js
function Title({ title, subtitle, titleMetadata, compactTitle, hasSubtitleMaxWidth }) {
	const className = classNames(styles$3.Title, subtitle && styles$3.TitleWithSubtitle);
	const titleMarkup = title ? /* @__PURE__ */ React.createElement("h1", { className }, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "headingLg",
		fontWeight: "bold"
	}, title)) : null;
	const titleMetadataMarkup = titleMetadata ? /* @__PURE__ */ React.createElement(Bleed, { marginBlock: "100" }, titleMetadata) : null;
	const wrappedTitleMarkup = /* @__PURE__ */ React.createElement("div", { className: styles$3.TitleWrapper }, titleMarkup, titleMetadataMarkup);
	const subtitleMarkup = subtitle ? /* @__PURE__ */ React.createElement("div", { className: classNames(styles$3.SubTitle, compactTitle && styles$3.SubtitleCompact, hasSubtitleMaxWidth && styles$3.SubtitleMaxWidth) }, /* @__PURE__ */ React.createElement(Text, {
		as: "p",
		variant: "bodySm",
		tone: "subdued"
	}, subtitle)) : null;
	return /* @__PURE__ */ React.createElement(React.Fragment, null, wrappedTitleMarkup, subtitleMarkup);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Page/components/Header/Header.js
var SHORT_TITLE = 20;
var REALLY_SHORT_TITLE = 8;
var LONG_TITLE = 34;
function Header({ title, subtitle, pageReadyAccessibilityLabel, titleMetadata, additionalMetadata, titleHidden = false, primaryAction, pagination, filterActions, backAction, secondaryActions = [], actionGroups = [], compactTitle = false, onActionRollup }) {
	const i18n = useI18n();
	const { isNavigationCollapsed } = useMediaQuery();
	const isSingleRow = !primaryAction && !pagination && (isInterface(secondaryActions) && !secondaryActions.length || isReactElement(secondaryActions)) && !actionGroups.length;
	const hasActionGroupsOrSecondaryActions = actionGroups.length > 0 || isInterface(secondaryActions) && secondaryActions.length > 0 || isReactElement(secondaryActions);
	const breadcrumbMarkup = backAction ? /* @__PURE__ */ React.createElement("div", { className: styles$4.BreadcrumbWrapper }, /* @__PURE__ */ React.createElement(Box, {
		maxWidth: "100%",
		paddingInlineEnd: "100",
		printHidden: true
	}, /* @__PURE__ */ React.createElement(Breadcrumbs, { backAction }))) : null;
	const paginationMarkup = pagination && !isNavigationCollapsed ? /* @__PURE__ */ React.createElement("div", { className: styles$4.PaginationWrapper }, /* @__PURE__ */ React.createElement(Box, { printHidden: true }, /* @__PURE__ */ React.createElement(Pagination, Object.assign({}, pagination, {
		hasPrevious: pagination.hasPrevious,
		hasNext: pagination.hasNext
	})))) : null;
	const pageTitleMarkup = /* @__PURE__ */ React.createElement("div", { className: classNames(styles$4.TitleWrapper, !hasActionGroupsOrSecondaryActions && styles$4.TitleWrapperExpand) }, /* @__PURE__ */ React.createElement(Title, {
		title,
		subtitle,
		titleMetadata,
		compactTitle,
		hasSubtitleMaxWidth: hasActionGroupsOrSecondaryActions
	}));
	const labelForPageReadyAccessibilityLabel = pageReadyAccessibilityLabel || title;
	const pageReadyAccessibilityLabelMarkup = labelForPageReadyAccessibilityLabel ? /* @__PURE__ */ React.createElement("div", { role: "status" }, /* @__PURE__ */ React.createElement(Text, {
		visuallyHidden: true,
		as: "p"
	}, i18n.translate("Polaris.Page.Header.pageReadyAccessibilityLabel", { title: labelForPageReadyAccessibilityLabel }))) : void 0;
	const primaryActionMarkup = primaryAction ? /* @__PURE__ */ React.createElement(PrimaryActionMarkup, { primaryAction }) : null;
	let actionMenuMarkup = null;
	if (isInterface(secondaryActions) && (secondaryActions.length > 0 || hasGroupsWithActions(actionGroups))) actionMenuMarkup = /* @__PURE__ */ React.createElement(ActionMenu, {
		actions: secondaryActions,
		groups: actionGroups,
		rollup: isNavigationCollapsed,
		rollupActionsLabel: title ? i18n.translate("Polaris.Page.Header.rollupActionsLabel", { title }) : void 0,
		onActionRollup
	});
	else if (isReactElement(secondaryActions)) actionMenuMarkup = /* @__PURE__ */ React.createElement(React.Fragment, null, secondaryActions);
	const navigationMarkup = breadcrumbMarkup || paginationMarkup ? /* @__PURE__ */ React.createElement(Box, {
		printHidden: true,
		paddingBlockEnd: "100",
		paddingInlineEnd: actionMenuMarkup && isNavigationCollapsed ? "1000" : void 0
	}, /* @__PURE__ */ React.createElement(InlineStack, {
		gap: "400",
		align: "space-between",
		blockAlign: "center"
	}, breadcrumbMarkup, paginationMarkup)) : null;
	const additionalMetadataMarkup = additionalMetadata ? /* @__PURE__ */ React.createElement("div", { className: styles$4.AdditionalMetaData }, /* @__PURE__ */ React.createElement(Text, {
		tone: "subdued",
		as: "span",
		variant: "bodySm"
	}, additionalMetadata)) : null;
	const headerClassNames = classNames(isSingleRow && styles$4.isSingleRow, navigationMarkup && styles$4.hasNavigation, actionMenuMarkup && styles$4.hasActionMenu, isNavigationCollapsed && styles$4.mobileView, !backAction && styles$4.noBreadcrumbs, title && title.length < LONG_TITLE && styles$4.mediumTitle, title && title.length > LONG_TITLE && styles$4.longTitle);
	const { slot1, slot2, slot3, slot4, slot5 } = determineLayout({
		actionMenuMarkup,
		additionalMetadataMarkup,
		breadcrumbMarkup,
		isNavigationCollapsed,
		pageTitleMarkup,
		paginationMarkup,
		primaryActionMarkup,
		title
	});
	return /* @__PURE__ */ React.createElement(Box, {
		position: "relative",
		paddingBlockStart: {
			xs: "400",
			md: "600"
		},
		paddingBlockEnd: {
			xs: "400",
			md: "600"
		},
		paddingInlineStart: {
			xs: "400",
			sm: "0"
		},
		paddingInlineEnd: {
			xs: "400",
			sm: "0"
		},
		visuallyHidden: titleHidden
	}, pageReadyAccessibilityLabelMarkup, /* @__PURE__ */ React.createElement("div", { className: headerClassNames }, /* @__PURE__ */ React.createElement(FilterActionsProvider, { filterActions: Boolean(filterActions) }, /* @__PURE__ */ React.createElement(ConditionalRender, { condition: [
		slot1,
		slot2,
		slot3,
		slot4
	].some(notNull) }, /* @__PURE__ */ React.createElement("div", { className: styles$4.Row }, slot1, slot2, /* @__PURE__ */ React.createElement(ConditionalRender, { condition: [slot3, slot4].some(notNull) }, /* @__PURE__ */ React.createElement("div", { className: styles$4.RightAlign }, /* @__PURE__ */ React.createElement(ConditionalWrapper, {
		condition: [slot3, slot4].every(notNull),
		wrapper: (children) => /* @__PURE__ */ React.createElement("div", { className: styles$4.Actions }, children)
	}, slot3, slot4))))), /* @__PURE__ */ React.createElement(ConditionalRender, { condition: [slot5].some(notNull) }, /* @__PURE__ */ React.createElement("div", { className: styles$4.Row }, /* @__PURE__ */ React.createElement(InlineStack, { gap: "400" }, slot5))))));
}
function PrimaryActionMarkup({ primaryAction }) {
	const { isNavigationCollapsed } = useMediaQuery();
	let actionMarkup;
	if (isInterface(primaryAction)) {
		const { primary: isPrimary, helpText } = primaryAction;
		const primary = isPrimary === void 0 ? true : isPrimary;
		const content = buttonFrom(shouldShowIconOnly(isNavigationCollapsed, primaryAction), { variant: primary ? "primary" : void 0 });
		actionMarkup = helpText ? /* @__PURE__ */ React.createElement(Tooltip, { content: helpText }, content) : content;
	} else actionMarkup = primaryAction;
	return /* @__PURE__ */ React.createElement("div", { className: styles$4.PrimaryActionWrapper }, /* @__PURE__ */ React.createElement(Box, { printHidden: true }, actionMarkup));
}
function shouldShowIconOnly(isMobile, action) {
	let { content, accessibilityLabel } = action;
	const { icon } = action;
	if (icon == null) return {
		...action,
		icon: void 0
	};
	if (isMobile) {
		accessibilityLabel = accessibilityLabel || content;
		content = void 0;
	}
	return {
		...action,
		content,
		accessibilityLabel,
		icon
	};
}
function notNull(value) {
	return value != null;
}
function determineLayout({ actionMenuMarkup, additionalMetadataMarkup, breadcrumbMarkup, isNavigationCollapsed, pageTitleMarkup, paginationMarkup, primaryActionMarkup, title }) {
	const layouts = {
		mobileCompact: {
			slots: {
				slot1: null,
				slot2: pageTitleMarkup,
				slot3: actionMenuMarkup,
				slot4: primaryActionMarkup,
				slot5: additionalMetadataMarkup
			},
			condition: isNavigationCollapsed && breadcrumbMarkup == null && title != null && title.length <= REALLY_SHORT_TITLE
		},
		mobileDefault: {
			slots: {
				slot1: breadcrumbMarkup,
				slot2: pageTitleMarkup,
				slot3: actionMenuMarkup,
				slot4: primaryActionMarkup,
				slot5: additionalMetadataMarkup
			},
			condition: isNavigationCollapsed
		},
		desktopCompact: {
			slots: {
				slot1: breadcrumbMarkup,
				slot2: pageTitleMarkup,
				slot3: actionMenuMarkup,
				slot4: primaryActionMarkup,
				slot5: additionalMetadataMarkup
			},
			condition: !isNavigationCollapsed && paginationMarkup == null && actionMenuMarkup == null && title != null && title.length <= SHORT_TITLE
		},
		desktopDefault: {
			slots: {
				slot1: breadcrumbMarkup,
				slot2: pageTitleMarkup,
				slot3: /* @__PURE__ */ React.createElement(React.Fragment, null, actionMenuMarkup, primaryActionMarkup),
				slot4: paginationMarkup,
				slot5: additionalMetadataMarkup
			},
			condition: !isNavigationCollapsed
		}
	};
	return (Object.values(layouts).find((layout) => layout.condition) || layouts.desktopDefault).slots;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Page/Page.js
function Page({ children, fullWidth, narrowWidth, ...rest }) {
	const pageClassName = classNames(styles$5.Page, fullWidth && styles$5.fullWidth, narrowWidth && styles$5.narrowWidth);
	const hasHeaderContent = rest.title != null && rest.title !== "" || rest.subtitle != null && rest.subtitle !== "" || rest.primaryAction != null || rest.secondaryActions != null && (isInterface(rest.secondaryActions) && rest.secondaryActions.length > 0 || isReactElement(rest.secondaryActions)) || rest.actionGroups != null && rest.actionGroups.length > 0 || rest.backAction != null;
	const contentClassName = classNames(!hasHeaderContent && styles$5.Content);
	const headerMarkup = hasHeaderContent ? /* @__PURE__ */ React.createElement(Header, Object.assign({ filterActions: true }, rest)) : null;
	return /* @__PURE__ */ React.createElement("div", { className: pageClassName }, headerMarkup, /* @__PURE__ */ React.createElement("div", { className: contentClassName }, children));
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ProgressBar/ProgressBar.css.js
var styles$2 = {
	"ProgressBar": "Polaris-ProgressBar",
	"sizeSmall": "Polaris-ProgressBar--sizeSmall",
	"sizeMedium": "Polaris-ProgressBar--sizeMedium",
	"sizeLarge": "Polaris-ProgressBar--sizeLarge",
	"toneHighlight": "Polaris-ProgressBar--toneHighlight",
	"tonePrimary": "Polaris-ProgressBar--tonePrimary",
	"toneSuccess": "Polaris-ProgressBar--toneSuccess",
	"toneCritical": "Polaris-ProgressBar--toneCritical",
	"Indicator": "Polaris-ProgressBar__Indicator",
	"IndicatorAppearActive": "Polaris-ProgressBar__IndicatorAppearActive",
	"IndicatorAppearDone": "Polaris-ProgressBar__IndicatorAppearDone",
	"Progress": "Polaris-ProgressBar__Progress",
	"Label": "Polaris-ProgressBar__Label"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/ProgressBar/ProgressBar.js
function ProgressBar({ progress = 0, size = "medium", tone = "highlight", animated: hasAppearAnimation = true, ariaLabelledBy }) {
	const theme = useTheme();
	const i18n = useI18n();
	const indicatorRef = useRef(null);
	const className = classNames(styles$2.ProgressBar, size && styles$2[variationName("size", size)], tone && styles$2[variationName("tone", tone)]);
	const parsedProgress = parseProgress(progress, i18n.translate(progress < 0 ? "Polaris.ProgressBar.negativeWarningMessage" : "Polaris.ProgressBar.exceedWarningMessage", { progress }));
	const progressBarDuration = hasAppearAnimation ? theme.motion["motion-duration-500"] : theme.motion["motion-duration-0"];
	return /* @__PURE__ */ React.createElement("div", { className }, /* @__PURE__ */ React.createElement("progress", {
		"aria-labelledby": ariaLabelledBy,
		className: styles$2.Progress,
		value: parsedProgress,
		max: "100"
	}), /* @__PURE__ */ React.createElement(CSSTransition, {
		in: true,
		appear: true,
		timeout: parseInt(progressBarDuration, 10),
		nodeRef: indicatorRef,
		classNames: {
			appearActive: styles$2.IndicatorAppearActive,
			appearDone: styles$2.IndicatorAppearDone
		}
	}, /* @__PURE__ */ React.createElement("div", {
		ref: indicatorRef,
		className: styles$2.Indicator,
		style: {
			"--pc-progress-bar-duration": progressBarDuration,
			"--pc-progress-bar-percent": parsedProgress / 100
		}
	}, /* @__PURE__ */ React.createElement("span", { className: styles$2.Label }, parsedProgress, "%"))));
}
function parseProgress(progress, warningMessage) {
	let progressWidth;
	if (progress < 0) {
		if (process.env.NODE_ENV === "development") console.warn(warningMessage);
		progressWidth = 0;
	} else if (progress > 100) {
		if (process.env.NODE_ENV === "development") console.warn(warningMessage);
		progressWidth = 100;
	} else progressWidth = progress;
	return progressWidth;
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Select/Select.css.js
var styles$1 = {
	"Select": "Polaris-Select",
	"disabled": "Polaris-Select--disabled",
	"error": "Polaris-Select--error",
	"Backdrop": "Polaris-Select__Backdrop",
	"Input": "Polaris-Select__Input",
	"Content": "Polaris-Select__Content",
	"InlineLabel": "Polaris-Select__InlineLabel",
	"Icon": "Polaris-Select__Icon",
	"SelectedOption": "Polaris-Select__SelectedOption",
	"Prefix": "Polaris-Select__Prefix",
	"hover": "Polaris-Select--hover",
	"toneMagic": "Polaris-Select--toneMagic"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Select/Select.js
var PLACEHOLDER_VALUE = "";
function Select({ options: optionsProp, label, labelAction, labelHidden: labelHiddenProp, labelInline, disabled, helpText, placeholder, id: idProp, name, value = PLACEHOLDER_VALUE, error, onChange, onFocus, onBlur, requiredIndicator, tone }) {
	const { value: focused, toggle: toggleFocused } = useToggle(false);
	const uniqId = useId();
	const id = idProp ?? uniqId;
	const labelHidden = labelInline ? true : labelHiddenProp;
	const className = classNames(styles$1.Select, error && styles$1.error, tone && styles$1[variationName("tone", tone)], disabled && styles$1.disabled);
	const handleFocus = useCallback((event) => {
		toggleFocused();
		onFocus?.(event);
	}, [onFocus, toggleFocused]);
	const handleBlur = useCallback((event) => {
		toggleFocused();
		onBlur?.(event);
	}, [onBlur, toggleFocused]);
	const handleChange = onChange ? (event) => onChange(event.currentTarget.value, id) : void 0;
	const describedBy = [];
	if (helpText) describedBy.push(helpTextID$1(id));
	if (error) describedBy.push(`${id}Error`);
	let normalizedOptions = (optionsProp || []).map(normalizeOption);
	if (placeholder) normalizedOptions = [{
		label: placeholder,
		value: PLACEHOLDER_VALUE,
		disabled: true
	}, ...normalizedOptions];
	const inlineLabelMarkup = labelInline && /* @__PURE__ */ React.createElement(Box, { paddingInlineEnd: "100" }, /* @__PURE__ */ React.createElement(Text, {
		as: "span",
		variant: "bodyMd",
		tone: tone && tone === "magic" && !focused ? "magic-subdued" : "subdued",
		truncate: true
	}, label));
	const selectedOption = getSelectedOption(normalizedOptions, value);
	const prefixMarkup = selectedOption.prefix && /* @__PURE__ */ React.createElement("div", { className: styles$1.Prefix }, selectedOption.prefix);
	const contentMarkup = /* @__PURE__ */ React.createElement("div", {
		className: styles$1.Content,
		"aria-hidden": true,
		"aria-disabled": disabled
	}, inlineLabelMarkup, prefixMarkup, /* @__PURE__ */ React.createElement("span", { className: styles$1.SelectedOption }, selectedOption.label), /* @__PURE__ */ React.createElement("span", { className: styles$1.Icon }, /* @__PURE__ */ React.createElement(Icon, { source: SvgSelectIcon })));
	const optionsMarkup = normalizedOptions.map(renderOption);
	return /* @__PURE__ */ React.createElement(Labelled, {
		id,
		label,
		error,
		action: labelAction,
		labelHidden,
		helpText,
		requiredIndicator,
		disabled
	}, /* @__PURE__ */ React.createElement("div", { className }, /* @__PURE__ */ React.createElement("select", {
		id,
		name,
		value,
		className: styles$1.Input,
		disabled,
		onFocus: handleFocus,
		onBlur: handleBlur,
		onChange: handleChange,
		"aria-invalid": Boolean(error),
		"aria-describedby": describedBy.length ? describedBy.join(" ") : void 0,
		"aria-required": requiredIndicator
	}, optionsMarkup), contentMarkup, /* @__PURE__ */ React.createElement("div", { className: styles$1.Backdrop })));
}
function isString(option) {
	return typeof option === "string";
}
function isGroup(option) {
	return typeof option === "object" && "options" in option && option.options != null;
}
function normalizeStringOption(option) {
	return {
		label: option,
		value: option
	};
}
/**
* Converts a string option (and each string option in a Group) into
* an Option object.
*/
function normalizeOption(option) {
	if (isString(option)) return normalizeStringOption(option);
	else if (isGroup(option)) {
		const { title, options } = option;
		return {
			title,
			options: options.map((option) => {
				return isString(option) ? normalizeStringOption(option) : option;
			})
		};
	}
	return option;
}
/**
* Gets the text to display in the UI, for the currently selected option
*/
function getSelectedOption(options, value) {
	const flatOptions = flattenOptions(options);
	let selectedOption = flatOptions.find((option) => value === option.value);
	if (selectedOption === void 0) selectedOption = flatOptions.find((option) => !option.hidden);
	return selectedOption || {
		value: "",
		label: ""
	};
}
/**
* Ungroups an options array
*/
function flattenOptions(options) {
	let flatOptions = [];
	options.forEach((optionOrGroup) => {
		if (isGroup(optionOrGroup)) flatOptions = flatOptions.concat(optionOrGroup.options);
		else flatOptions.push(optionOrGroup);
	});
	return flatOptions;
}
function renderSingleOption(option) {
	const { value, label, prefix: _prefix, key, ...rest } = option;
	return /* @__PURE__ */ React.createElement("option", Object.assign({
		key: key ?? value,
		value
	}, rest), label);
}
function renderOption(optionOrGroup) {
	if (isGroup(optionOrGroup)) {
		const { title, options } = optionOrGroup;
		return /* @__PURE__ */ React.createElement("optgroup", {
			label: title,
			key: title
		}, options.map(renderSingleOption));
	}
	return renderSingleOption(optionOrGroup);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Thumbnail/Thumbnail.css.js
var styles = {
	"Thumbnail": "Polaris-Thumbnail",
	"sizeExtraSmall": "Polaris-Thumbnail--sizeExtraSmall",
	"sizeSmall": "Polaris-Thumbnail--sizeSmall",
	"sizeMedium": "Polaris-Thumbnail--sizeMedium",
	"sizeLarge": "Polaris-Thumbnail--sizeLarge",
	"transparent": "Polaris-Thumbnail--transparent"
};
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Thumbnail/Thumbnail.js
function Thumbnail({ source, alt, size = "medium", transparent }) {
	const className = classNames(styles.Thumbnail, size && styles[variationName("size", size)], transparent && styles.transparent);
	const content = typeof source === "string" ? /* @__PURE__ */ React.createElement(Image, {
		alt,
		source
	}) : /* @__PURE__ */ React.createElement(Icon, {
		accessibilityLabel: alt,
		source
	});
	return /* @__PURE__ */ React.createElement("span", { className }, content);
}
//#endregion
//#region node_modules/@shopify/polaris/build/esm/components/Toast/Toast.js
var Toast = /* @__PURE__ */ memo(function Toast(props) {
	const id = useId();
	const { showToast, hideToast } = useFrame();
	useDeepEffect(() => {
		showToast({
			id,
			...props
		});
		return () => {
			hideToast({ id });
		};
	}, [props]);
	return null;
});
//#endregion
//#region node_modules/@shopify/polaris/build/esm/styles.css?url
var styles_default = "/assets/styles-CAaziDo7.css";
var en_default = { Polaris: /* @__PURE__ */ JSON.parse("{\"ActionMenu\":{\"Actions\":{\"moreActions\":\"More actions\"},\"RollupActions\":{\"rollupButton\":\"View actions\"}},\"ActionList\":{\"SearchField\":{\"clearButtonLabel\":\"Clear\",\"search\":\"Search\",\"placeholder\":\"Search actions\"}},\"Avatar\":{\"label\":\"Avatar\",\"labelWithInitials\":\"Avatar with initials {initials}\"},\"Autocomplete\":{\"spinnerAccessibilityLabel\":\"Loading\",\"ellipsis\":\"{content}…\"},\"Badge\":{\"PROGRESS_LABELS\":{\"incomplete\":\"Incomplete\",\"partiallyComplete\":\"Partially complete\",\"complete\":\"Complete\"},\"TONE_LABELS\":{\"info\":\"Info\",\"success\":\"Success\",\"warning\":\"Warning\",\"critical\":\"Critical\",\"attention\":\"Attention\",\"new\":\"New\",\"readOnly\":\"Read-only\",\"enabled\":\"Enabled\"},\"progressAndTone\":\"{toneLabel} {progressLabel}\"},\"Banner\":{\"dismissButton\":\"Dismiss notification\"},\"Button\":{\"spinnerAccessibilityLabel\":\"Loading\"},\"Common\":{\"checkbox\":\"checkbox\",\"undo\":\"Undo\",\"cancel\":\"Cancel\",\"clear\":\"Clear\",\"close\":\"Close\",\"submit\":\"Submit\",\"more\":\"More\"},\"ContextualSaveBar\":{\"save\":\"Save\",\"discard\":\"Discard\"},\"DataTable\":{\"sortAccessibilityLabel\":\"sort {direction} by\",\"navAccessibilityLabel\":\"Scroll table {direction} one column\",\"totalsRowHeading\":\"Totals\",\"totalRowHeading\":\"Total\"},\"DatePicker\":{\"previousMonth\":\"Show previous month, {previousMonthName} {showPreviousYear}\",\"nextMonth\":\"Show next month, {nextMonth} {nextYear}\",\"today\":\"Today \",\"start\":\"Start of range\",\"end\":\"End of range\",\"months\":{\"january\":\"January\",\"february\":\"February\",\"march\":\"March\",\"april\":\"April\",\"may\":\"May\",\"june\":\"June\",\"july\":\"July\",\"august\":\"August\",\"september\":\"September\",\"october\":\"October\",\"november\":\"November\",\"december\":\"December\"},\"days\":{\"monday\":\"Monday\",\"tuesday\":\"Tuesday\",\"wednesday\":\"Wednesday\",\"thursday\":\"Thursday\",\"friday\":\"Friday\",\"saturday\":\"Saturday\",\"sunday\":\"Sunday\"},\"daysAbbreviated\":{\"monday\":\"Mo\",\"tuesday\":\"Tu\",\"wednesday\":\"We\",\"thursday\":\"Th\",\"friday\":\"Fr\",\"saturday\":\"Sa\",\"sunday\":\"Su\"}},\"DiscardConfirmationModal\":{\"title\":\"Discard all unsaved changes\",\"message\":\"If you discard changes, you’ll delete any edits you made since you last saved.\",\"primaryAction\":\"Discard changes\",\"secondaryAction\":\"Continue editing\"},\"DropZone\":{\"single\":{\"overlayTextFile\":\"Drop file to upload\",\"overlayTextImage\":\"Drop image to upload\",\"overlayTextVideo\":\"Drop video to upload\",\"actionTitleFile\":\"Add file\",\"actionTitleImage\":\"Add image\",\"actionTitleVideo\":\"Add video\",\"actionHintFile\":\"or drop file to upload\",\"actionHintImage\":\"or drop image to upload\",\"actionHintVideo\":\"or drop video to upload\",\"labelFile\":\"Upload file\",\"labelImage\":\"Upload image\",\"labelVideo\":\"Upload video\"},\"allowMultiple\":{\"overlayTextFile\":\"Drop files to upload\",\"overlayTextImage\":\"Drop images to upload\",\"overlayTextVideo\":\"Drop videos to upload\",\"actionTitleFile\":\"Add files\",\"actionTitleImage\":\"Add images\",\"actionTitleVideo\":\"Add videos\",\"actionHintFile\":\"or drop files to upload\",\"actionHintImage\":\"or drop images to upload\",\"actionHintVideo\":\"or drop videos to upload\",\"labelFile\":\"Upload files\",\"labelImage\":\"Upload images\",\"labelVideo\":\"Upload videos\"},\"errorOverlayTextFile\":\"File type is not valid\",\"errorOverlayTextImage\":\"Image type is not valid\",\"errorOverlayTextVideo\":\"Video type is not valid\"},\"EmptySearchResult\":{\"altText\":\"Empty search results\"},\"Frame\":{\"skipToContent\":\"Skip to content\",\"navigationLabel\":\"Navigation\",\"Navigation\":{\"closeMobileNavigationLabel\":\"Close navigation\"}},\"FullscreenBar\":{\"back\":\"Back\",\"accessibilityLabel\":\"Exit fullscreen mode\"},\"Filters\":{\"moreFilters\":\"More filters\",\"moreFiltersWithCount\":\"More filters ({count})\",\"filter\":\"Filter {resourceName}\",\"noFiltersApplied\":\"No filters applied\",\"cancel\":\"Cancel\",\"done\":\"Done\",\"clearAllFilters\":\"Clear all filters\",\"clear\":\"Clear\",\"clearLabel\":\"Clear {filterName}\",\"addFilter\":\"Add filter\",\"clearFilters\":\"Clear all\",\"searchInView\":\"in:{viewName}\"},\"FilterPill\":{\"clear\":\"Clear\",\"unsavedChanges\":\"Unsaved changes - {label}\"},\"IndexFilters\":{\"searchFilterTooltip\":\"Search and filter\",\"searchFilterTooltipWithShortcut\":\"Search and filter (F)\",\"searchFilterAccessibilityLabel\":\"Search and filter results\",\"sort\":\"Sort your results\",\"addView\":\"Add a new view\",\"newView\":\"Custom search\",\"SortButton\":{\"ariaLabel\":\"Sort the results\",\"tooltip\":\"Sort\",\"title\":\"Sort by\",\"sorting\":{\"asc\":\"Ascending\",\"desc\":\"Descending\",\"az\":\"A-Z\",\"za\":\"Z-A\"}},\"EditColumnsButton\":{\"tooltip\":\"Edit columns\",\"accessibilityLabel\":\"Customize table column order and visibility\"},\"UpdateButtons\":{\"cancel\":\"Cancel\",\"update\":\"Update\",\"save\":\"Save\",\"saveAs\":\"Save as\",\"modal\":{\"title\":\"Save view as\",\"label\":\"Name\",\"sameName\":\"A view with this name already exists. Please choose a different name.\",\"save\":\"Save\",\"cancel\":\"Cancel\"}}},\"IndexProvider\":{\"defaultItemSingular\":\"Item\",\"defaultItemPlural\":\"Items\",\"allItemsSelected\":\"All {itemsLength}+ {resourceNamePlural} are selected\",\"selected\":\"{selectedItemsCount} selected\",\"a11yCheckboxDeselectAllSingle\":\"Deselect {resourceNameSingular}\",\"a11yCheckboxSelectAllSingle\":\"Select {resourceNameSingular}\",\"a11yCheckboxDeselectAllMultiple\":\"Deselect all {itemsLength} {resourceNamePlural}\",\"a11yCheckboxSelectAllMultiple\":\"Select all {itemsLength} {resourceNamePlural}\"},\"IndexTable\":{\"emptySearchTitle\":\"No {resourceNamePlural} found\",\"emptySearchDescription\":\"Try changing the filters or search term\",\"onboardingBadgeText\":\"New\",\"resourceLoadingAccessibilityLabel\":\"Loading {resourceNamePlural}…\",\"selectAllLabel\":\"Select all {resourceNamePlural}\",\"selected\":\"{selectedItemsCount} selected\",\"undo\":\"Undo\",\"selectAllItems\":\"Select all {itemsLength}+ {resourceNamePlural}\",\"selectItem\":\"Select {resourceName}\",\"selectButtonText\":\"Select\",\"sortAccessibilityLabel\":\"sort {direction} by\"},\"Loading\":{\"label\":\"Page loading bar\"},\"Modal\":{\"iFrameTitle\":\"body markup\",\"modalWarning\":\"These required properties are missing from Modal: {missingProps}\"},\"Page\":{\"Header\":{\"rollupActionsLabel\":\"View actions for {title}\",\"pageReadyAccessibilityLabel\":\"{title}. This page is ready\"}},\"Pagination\":{\"previous\":\"Previous\",\"next\":\"Next\",\"pagination\":\"Pagination\"},\"ProgressBar\":{\"negativeWarningMessage\":\"Values passed to the progress prop shouldn’t be negative. Resetting {progress} to 0.\",\"exceedWarningMessage\":\"Values passed to the progress prop shouldn’t exceed 100. Setting {progress} to 100.\"},\"ResourceList\":{\"sortingLabel\":\"Sort by\",\"defaultItemSingular\":\"item\",\"defaultItemPlural\":\"items\",\"showing\":\"Showing {itemsCount} {resource}\",\"showingTotalCount\":\"Showing {itemsCount} of {totalItemsCount} {resource}\",\"loading\":\"Loading {resource}\",\"selected\":\"{selectedItemsCount} selected\",\"allItemsSelected\":\"All {itemsLength}+ {resourceNamePlural} in your store are selected\",\"allFilteredItemsSelected\":\"All {itemsLength}+ {resourceNamePlural} in this filter are selected\",\"selectAllItems\":\"Select all {itemsLength}+ {resourceNamePlural} in your store\",\"selectAllFilteredItems\":\"Select all {itemsLength}+ {resourceNamePlural} in this filter\",\"emptySearchResultTitle\":\"No {resourceNamePlural} found\",\"emptySearchResultDescription\":\"Try changing the filters or search term\",\"selectButtonText\":\"Select\",\"a11yCheckboxDeselectAllSingle\":\"Deselect {resourceNameSingular}\",\"a11yCheckboxSelectAllSingle\":\"Select {resourceNameSingular}\",\"a11yCheckboxDeselectAllMultiple\":\"Deselect all {itemsLength} {resourceNamePlural}\",\"a11yCheckboxSelectAllMultiple\":\"Select all {itemsLength} {resourceNamePlural}\",\"Item\":{\"actionsDropdownLabel\":\"Actions for {accessibilityLabel}\",\"actionsDropdown\":\"Actions dropdown\",\"viewItem\":\"View details for {itemName}\"},\"BulkActions\":{\"actionsActivatorLabel\":\"Actions\",\"moreActionsActivatorLabel\":\"More actions\"}},\"SkeletonPage\":{\"loadingLabel\":\"Page loading\"},\"Tabs\":{\"newViewAccessibilityLabel\":\"Create new view\",\"newViewTooltip\":\"Create view\",\"toggleTabsLabel\":\"More views\",\"Tab\":{\"rename\":\"Rename view\",\"duplicate\":\"Duplicate view\",\"edit\":\"Edit view\",\"editColumns\":\"Edit columns\",\"delete\":\"Delete view\",\"copy\":\"Copy of {name}\",\"deleteModal\":{\"title\":\"Delete view?\",\"description\":\"This can’t be undone. {viewName} view will no longer be available in your admin.\",\"cancel\":\"Cancel\",\"delete\":\"Delete view\"}},\"RenameModal\":{\"title\":\"Rename view\",\"label\":\"Name\",\"cancel\":\"Cancel\",\"create\":\"Save\",\"errors\":{\"sameName\":\"A view with this name already exists. Please choose a different name.\"}},\"DuplicateModal\":{\"title\":\"Duplicate view\",\"label\":\"Name\",\"cancel\":\"Cancel\",\"create\":\"Create view\",\"errors\":{\"sameName\":\"A view with this name already exists. Please choose a different name.\"}},\"CreateViewModal\":{\"title\":\"Create new view\",\"label\":\"Name\",\"cancel\":\"Cancel\",\"create\":\"Create view\",\"errors\":{\"sameName\":\"A view with this name already exists. Please choose a different name.\"}}},\"Tag\":{\"ariaLabel\":\"Remove {children}\"},\"TextField\":{\"characterCount\":\"{count} characters\",\"characterCountWithMaxLength\":\"{count} of {limit} characters used\"},\"TooltipOverlay\":{\"accessibilityLabel\":\"Tooltip: {label}\"},\"TopBar\":{\"toggleMenuLabel\":\"Toggle menu\",\"SearchField\":{\"clearButtonLabel\":\"Clear\",\"search\":\"Search\"}},\"MediaCard\":{\"dismissButton\":\"Dismiss\",\"popoverButton\":\"Actions\"},\"VideoThumbnail\":{\"playButtonA11yLabel\":{\"default\":\"Play video\",\"defaultWithDuration\":\"Play video of length {duration}\",\"duration\":{\"hours\":{\"other\":{\"only\":\"{hourCount} hours\",\"andMinutes\":\"{hourCount} hours and {minuteCount} minutes\",\"andMinute\":\"{hourCount} hours and {minuteCount} minute\",\"minutesAndSeconds\":\"{hourCount} hours, {minuteCount} minutes, and {secondCount} seconds\",\"minutesAndSecond\":\"{hourCount} hours, {minuteCount} minutes, and {secondCount} second\",\"minuteAndSeconds\":\"{hourCount} hours, {minuteCount} minute, and {secondCount} seconds\",\"minuteAndSecond\":\"{hourCount} hours, {minuteCount} minute, and {secondCount} second\",\"andSeconds\":\"{hourCount} hours and {secondCount} seconds\",\"andSecond\":\"{hourCount} hours and {secondCount} second\"},\"one\":{\"only\":\"{hourCount} hour\",\"andMinutes\":\"{hourCount} hour and {minuteCount} minutes\",\"andMinute\":\"{hourCount} hour and {minuteCount} minute\",\"minutesAndSeconds\":\"{hourCount} hour, {minuteCount} minutes, and {secondCount} seconds\",\"minutesAndSecond\":\"{hourCount} hour, {minuteCount} minutes, and {secondCount} second\",\"minuteAndSeconds\":\"{hourCount} hour, {minuteCount} minute, and {secondCount} seconds\",\"minuteAndSecond\":\"{hourCount} hour, {minuteCount} minute, and {secondCount} second\",\"andSeconds\":\"{hourCount} hour and {secondCount} seconds\",\"andSecond\":\"{hourCount} hour and {secondCount} second\"}},\"minutes\":{\"other\":{\"only\":\"{minuteCount} minutes\",\"andSeconds\":\"{minuteCount} minutes and {secondCount} seconds\",\"andSecond\":\"{minuteCount} minutes and {secondCount} second\"},\"one\":{\"only\":\"{minuteCount} minute\",\"andSeconds\":\"{minuteCount} minute and {secondCount} seconds\",\"andSecond\":\"{minuteCount} minute and {secondCount} second\"}},\"seconds\":{\"other\":\"{secondCount} seconds\",\"one\":\"{secondCount} second\"}}}}}") };
//#endregion
//#region app/root.jsx
var root_exports = /* @__PURE__ */ __exportAll({
	default: () => root_default,
	links: () => links
});
var links = () => [
	{
		rel: "preconnect",
		href: "https://cdn.shopify.com/"
	},
	{
		rel: "stylesheet",
		href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
	},
	{
		rel: "stylesheet",
		href: styles_default
	}
];
function PolarisRouterLink({ url, children, external, ...rest }) {
	if (external) return /* @__PURE__ */ jsx("a", {
		href: url,
		...rest,
		children
	});
	return /* @__PURE__ */ jsx(Link, {
		to: url,
		...rest,
		children
	});
}
var root_default = UNSAFE_withComponentProps(function Root() {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width,initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			/* @__PURE__ */ jsx(AppProvider$1, {
				i18n: en_default,
				linkComponent: PolarisRouterLink,
				children: /* @__PURE__ */ jsx(Outlet, {})
			}),
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
});
//#endregion
//#region app/routes/auth.login/error.server.jsx
function loginErrorMessage(loginErrors) {
	if (loginErrors?.shop === LoginErrorType.MissingShop) return { shop: "Please enter your shop domain to log in" };
	else if (loginErrors?.shop === LoginErrorType.InvalidShop) return { shop: "Please enter a valid shop domain to log in" };
	return {};
}
//#endregion
//#region app/routes/auth.login/route.jsx
var route_exports$1 = /* @__PURE__ */ __exportAll({
	action: () => action$12,
	default: () => route_default$1,
	loader: () => loader$14
});
var loader$14 = async ({ request }) => {
	const url = new URL(request.url);
	if (url.searchParams.get("shop")) throw redirect(`/auth?${url.searchParams.toString()}`);
	return { errors: loginErrorMessage(await login(request)) };
};
var action$12 = async ({ request }) => {
	return { errors: loginErrorMessage(await login(request)) };
};
var route_default$1 = UNSAFE_withComponentProps(function Index() {
	const { errors } = useLoaderData();
	const actionData = useActionData();
	const [shop, setShop] = useState("");
	const mergedErrors = actionData?.errors || errors || {};
	const hasError = Boolean(mergedErrors?.shop);
	return /* @__PURE__ */ jsx(Page, {
		title: "AI SEO Assistant",
		children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, {
			gap: "400",
			children: [
				hasError && /* @__PURE__ */ jsx(Banner, {
					title: "Login error",
					tone: "critical",
					children: /* @__PURE__ */ jsx(Text, {
						as: "p",
						variant: "bodyMd",
						children: mergedErrors.shop
					})
				}),
				/* @__PURE__ */ jsxs(Text, {
					as: "p",
					variant: "bodyMd",
					children: [
						"Enter your ",
						/* @__PURE__ */ jsx("strong", { children: ".myshopify.com" }),
						" domain to log in."
					]
				}),
				/* @__PURE__ */ jsx(Form, {
					method: "post",
					children: /* @__PURE__ */ jsxs(BlockStack, {
						gap: "300",
						children: [/* @__PURE__ */ jsx(TextField, {
							label: "Shop domain",
							value: shop,
							onChange: setShop,
							name: "shop",
							autoComplete: "on",
							placeholder: "my-shop-domain.myshopify.com",
							helpText: "example.myshopify.com",
							error: mergedErrors.shop
						}), /* @__PURE__ */ jsx(Button, {
							submit: true,
							variant: "primary",
							disabled: !shop.trim(),
							children: "Log in"
						})]
					})
				})
			]
		}) }) }) })
	});
});
//#endregion
//#region app/routes/webhooks.jsx
var webhooks_exports = /* @__PURE__ */ __exportAll({ action: () => action$11 });
var action$11 = async ({ request }) => {
	try {
		const { topic, shop } = await authenticate.webhook(request);
		if (topic === "CUSTOMERS_DATA_REQUEST" || topic === "CUSTOMERS_REDACT" || topic === "SHOP_REDACT") {
			console.log(`[COMPLIANCE] ${topic} received for ${shop}`);
			return new Response("OK", { status: 200 });
		}
		return new Response("OK", { status: 200 });
	} catch (err) {
		console.error("Webhook verification failed:", err);
		return new Response("Unauthorized", { status: 401 });
	}
};
//#endregion
//#region app/routes/webhooks.customers.data_request.jsx
var webhooks_customers_data_request_exports = /* @__PURE__ */ __exportAll({ action: () => action$10 });
/**
* Mandatory compliance webhook: customers/data_request
* If you don't store customer data, you can simply acknowledge the request (200).
* If you do store customer data, you must provide it to the store owner within 30 days.
*/
var action$10 = async ({ request }) => {
	const { shop, topic, payload } = await authenticate.webhook(request);
	console.log(`Received ${topic} webhook for ${shop}`);
	return new Response(null, { status: 200 });
};
//#endregion
//#region app/routes/webhooks.app.scopes_update.jsx
var webhooks_app_scopes_update_exports = /* @__PURE__ */ __exportAll({ action: () => action$9 });
var action$9 = async ({ request }) => {
	const { payload, session, topic, shop } = await authenticate.webhook(request);
	console.log(`Received ${topic} webhook for ${shop}`);
	const current = payload.current;
	if (session) await prisma.session.update({
		where: { id: session.id },
		data: { scope: current.toString() }
	});
	return new Response();
};
//#endregion
//#region app/routes/webhooks.customers.redact.jsx
var webhooks_customers_redact_exports = /* @__PURE__ */ __exportAll({ action: () => action$8 });
/**
* Mandatory compliance webhook: customers/redact
* If you store customer data, delete/redact it.
*/
var action$8 = async ({ request }) => {
	const { shop, topic, payload } = await authenticate.webhook(request);
	console.log(`Received ${topic} webhook for ${shop}`);
	return new Response(null, { status: 200 });
};
//#endregion
//#region app/routes/webhooks.app.uninstalled.jsx
var webhooks_app_uninstalled_exports = /* @__PURE__ */ __exportAll({ action: () => action$7 });
var action$7 = async ({ request }) => {
	const { shop, topic } = await authenticate.webhook(request);
	console.log(`Received ${topic} webhook for ${shop}`);
	try {
		await prisma.$transaction([
			prisma.seoJob.deleteMany({ where: { shop } }),
			prisma.freePlanUsageMonthly.deleteMany({ where: { shop } }),
			prisma.billingSubscription.deleteMany({ where: { shop } }),
			prisma.session.deleteMany({ where: { shop } })
		]);
	} catch (err) {
		console.error("Uninstall cleanup error:", err);
	}
	return new Response();
};
//#endregion
//#region app/routes/webhooks.shop.redact.jsx
var webhooks_shop_redact_exports = /* @__PURE__ */ __exportAll({ action: () => action$6 });
/**
* Mandatory compliance webhook: shop/redact
* Delete/redact all shop data that your app stored for this shop.
*
* Note: We intentionally do not log webhook payloads to avoid accidentally logging PII.
*/
var action$6 = async ({ request }) => {
	const { shop, topic } = await authenticate.webhook(request);
	console.log(`Received ${topic} webhook for ${shop}`);
	try {
		await prisma.$transaction([
			prisma.billingSubscription.deleteMany({ where: { shop } }),
			prisma.freePlanUsageMonthly.deleteMany({ where: { shop } }),
			prisma.seoJob.deleteMany({ where: { shop } }),
			prisma.session.deleteMany({ where: { shop } })
		]);
	} catch (e) {
		console.error("shop/redact cleanup error:", e);
	}
	return new Response(null, { status: 200 });
};
//#endregion
//#region app/routes/_index/route.jsx
var route_exports = /* @__PURE__ */ __exportAll({
	default: () => route_default,
	loader: () => loader$13
});
var loader$13 = async ({ request }) => {
	const url = new URL(request.url);
	if (url.searchParams.get("shop")) throw redirect(`/app?${url.searchParams.toString()}`);
	return { showForm: Boolean(login) };
};
var route_default = UNSAFE_withComponentProps(function Index() {
	const { showForm } = useLoaderData();
	const [shop, setShop] = useState("");
	return /* @__PURE__ */ jsx(Page, {
		title: "AI SEO Assistant",
		children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, {
			gap: "400",
			children: [/* @__PURE__ */ jsxs(Text, {
				as: "p",
				variant: "bodyMd",
				children: [
					"Enter your ",
					/* @__PURE__ */ jsx("strong", { children: ".myshopify.com" }),
					" domain to log in."
				]
			}), showForm ? /* @__PURE__ */ jsx(Form, {
				method: "post",
				action: "/auth/login",
				children: /* @__PURE__ */ jsxs(BlockStack, {
					gap: "300",
					children: [/* @__PURE__ */ jsx(TextField, {
						label: "Shop domain",
						name: "shop",
						value: shop,
						onChange: setShop,
						autoComplete: "off",
						placeholder: "my-shop-domain.myshopify.com"
					}), /* @__PURE__ */ jsx(Button, {
						submit: true,
						variant: "primary",
						children: "Log in"
					})]
				})
			}) : /* @__PURE__ */ jsx(Text, {
				as: "p",
				variant: "bodyMd",
				children: "Login route is not configured."
			})]
		}) }) }) })
	});
});
//#endregion
//#region app/routes/auth.$.jsx
var auth_$_exports = /* @__PURE__ */ __exportAll({
	headers: () => headers$6,
	loader: () => loader$12
});
var loader$12 = async ({ request }) => {
	const { session } = await authenticate.admin(request);
	await registerWebhooks({ session });
	return null;
};
var headers$6 = (headersArgs) => {
	return boundary.headers(headersArgs);
};
//#endregion
//#region node_modules/@shopify/shopify-app-react-router/dist/esm/react/components/AppProvider/AppProvider.mjs
/**
* Sets up your app to look like the admin
*
* Adds Polaris Web components to the route.
* If embedded is true and apiKey is provided, then the App Bridge script will be added to the page.
*
* {@link https://shopify.dev/docs/apps/admin/embedded-app-home}
* {@link https://shopify.dev/docs/api/app-home/using-polaris-components}
* {@link https://shopify.dev/tools/app-bridge}
*
* @example
* <caption>Set up AppProvider for an embedded route</caption>
* <description>Wrap your route in the `AppProvider` component and pass in your API key.</description>
* ```ts
* // /app/routes/**\/*.ts
* import {useLoaderData} from 'react-router';
* import {authenticate} from '~/shopify.server';
* import {AppProvider} from '@shopify/shopify-app-react-router/react';
*
* export async function loader({ request }) {
*   await authenticate.admin(request);
*
*   return { apiKey: process.env.SHOPIFY_API_KEY };
* }
*
* export default function App() {
*   const { apiKey } = useLoaderData();
*
*   return (
*     <AppProvider embedded apiKey={apiKey}>
*       <Outlet />
*     </AppProvider>
*   );
* }
* ```
*
* @example
* <caption>Set up AppProvider for a non-embedded route</caption>
* <description>Add Polaris web components to the route, without adding the App Bridge script.</description>
* ```ts
* // /app/routes/**\/*.ts
* import {AppProvider} from '@shopify/shopify-app-react-router/react';
*
* export default function App() {
*   return (
*     <AppProvider embedded={false}>
*       <Outlet />
*     </AppProvider>
*   );
* }
* ```
*/
function AppProvider(props) {
	return jsxs(Fragment, { children: [
		props.embedded && jsx(AppBridge, { apiKey: props.apiKey }),
		jsx("script", { src: "https://cdn.shopify.com/shopifycloud/polaris.js" }),
		props.children
	] });
}
function AppBridge({ apiKey }) {
	const navigate = useNavigate();
	useEffect(() => {
		const handleNavigate = (event) => {
			const href = event.target?.getAttribute("href");
			if (href) navigate(href);
		};
		document.addEventListener("shopify:navigate", handleNavigate);
		return () => {
			document.removeEventListener("shopify:navigate", handleNavigate);
		};
	}, [navigate]);
	return jsx("script", {
		src: "https://cdn.shopify.com/shopifycloud/app-bridge.js",
		"data-api-key": apiKey
	});
}
createContext(null);
//#endregion
//#region node_modules/@shopify/app-bridge-react/build/esm/components/NavMenu.js
/**
* This component is a wrapper around the App Bridge `ui-nav-menu` element.
* It is used to create a navigation menu for your app.
*
* @see {@link https://shopify.dev/docs/api/app-bridge-library/react-components/navmenu}
*/
var NavMenu = "ui-nav-menu";
//#endregion
//#region app/routes/app.jsx
var app_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$5,
	default: () => app_default,
	headers: () => headers$5,
	loader: () => loader$11
});
var loader$11 = async ({ request }) => {
	const { getBillingContext } = await import("./assets/billing.gating.server-Ct-YnoxI.js");
	const { session, admin } = await authenticate.admin(request);
	const url = new URL(request.url);
	const host = url.searchParams.get("host") || "";
	const embedded = url.searchParams.get("embedded") || "";
	const billing = await getBillingContext({
		shop: session.shop,
		admin
	});
	return {
		apiKey: process.env.SHOPIFY_API_KEY || "",
		shop: session.shop || "",
		host,
		embedded,
		billing: {
			isPro: billing.isPro,
			planKey: billing.planKey,
			free: billing.free
		}
	};
};
var app_default = UNSAFE_withComponentProps(function App() {
	const { apiKey, shop, host, embedded, billing } = useLoaderData();
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (shop) window.sessionStorage.setItem("shopifyShop", shop);
		if (host) window.sessionStorage.setItem("shopifyHost", host);
		if (embedded) window.sessionStorage.setItem("shopifyEmbedded", embedded);
	}, [
		shop,
		host,
		embedded
	]);
	const navQuery = useMemo(() => {
		const out = new URLSearchParams();
		if (shop) out.set("shop", shop);
		if (host) out.set("host", host);
		if (embedded) out.set("embedded", embedded);
		const qs = out.toString();
		return qs ? `?${qs}` : "";
	}, [
		shop,
		host,
		embedded
	]);
	return /* @__PURE__ */ jsxs(AppProvider, {
		apiKey,
		embedded: true,
		children: [
			/* @__PURE__ */ jsxs(NavMenu, { children: [
				/* @__PURE__ */ jsx("a", {
					href: `/app${navQuery}`,
					rel: "home",
					children: "Home"
				}),
				/* @__PURE__ */ jsx("a", {
					href: `/app/onboarding${navQuery}`,
					children: "Get started"
				}),
				/* @__PURE__ */ jsx("a", {
					href: `/app/seo-tools${navQuery}`,
					children: "SEO Tools"
				}),
				/* @__PURE__ */ jsx("a", {
					href: `/app/generation-history${navQuery}`,
					children: "Generation History"
				}),
				/* @__PURE__ */ jsx("a", {
					href: `/app/billing${navQuery}`,
					children: "Billing"
				}),
				/* @__PURE__ */ jsx("a", {
					href: `/app/settings${navQuery}`,
					children: "Settings"
				})
			] }),
			!billing?.isPro ? /* @__PURE__ */ jsx(Box, {
				padding: "300",
				children: /* @__PURE__ */ jsx(Banner, {
					tone: "warning",
					title: "Free plan limits",
					children: /* @__PURE__ */ jsxs(BlockStack, {
						gap: "200",
						children: [
							/* @__PURE__ */ jsx(Text, {
								as: "p",
								variant: "bodyMd",
								children: "You are currently on the Free plan. Some features are limited."
							}),
							billing?.free ? /* @__PURE__ */ jsxs(Text, {
								as: "p",
								variant: "bodySm",
								tone: "subdued",
								children: [
									"Monthly usage: ",
									billing.free.used,
									"/",
									billing.free.limit,
									" used · ",
									billing.free.remaining,
									" remaining"
								]
							}) : null,
							/* @__PURE__ */ jsx(InlineStack, {
								gap: "200",
								wrap: true,
								children: /* @__PURE__ */ jsx(Button, {
									url: `/app/billing${navQuery}`,
									variant: "primary",
									children: "Upgrade to Pro"
								})
							})
						]
					})
				})
			}) : null,
			/* @__PURE__ */ jsx(Outlet, {})
		]
	});
});
var ErrorBoundary$5 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const err = useRouteError();
	console.error("Route ErrorBoundary:", err);
	let title = "Route error";
	let message = "Unknown error";
	if (isRouteErrorResponse(err)) {
		title = `Error ${err.status}`;
		message = err.data || err.statusText;
	} else if (err instanceof Error) message = err.message;
	else message = String(err);
	return /* @__PURE__ */ jsx(Page, {
		title,
		children: /* @__PURE__ */ jsx(Banner, {
			tone: "critical",
			title,
			children: /* @__PURE__ */ jsx(Text, {
				as: "p",
				variant: "bodyMd",
				children: message
			})
		})
	});
});
var headers$5 = (headersArgs) => boundary.headers(headersArgs);
//#endregion
//#region app/routes/app.debug-report.$jobId.jsx
var app_debug_report_$jobId_exports = /* @__PURE__ */ __exportAll({ loader: () => loader$10 });
function jsonResponse$3(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store"
		}
	});
}
async function loader$10({ request, params }) {
	const { session } = await authenticate.admin(request);
	const shop = session.shop;
	const jobId = String(params.jobId || "").trim();
	if (!jobId) return jsonResponse$3({ error: "Missing jobId" }, 400);
	const job = await prisma.seoJob.findFirst({
		where: {
			id: jobId,
			shop
		},
		include: { items: { orderBy: { productTitle: "asc" } } }
	});
	if (!job) return jsonResponse$3({ error: "Job not found" }, 404);
	const report = {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		shop,
		job: {
			id: job.id,
			status: job.status,
			phase: job.phase,
			language: job.language,
			total: job.total,
			okCount: job.okCount,
			failedCount: job.failedCount,
			publishOkCount: job.publishOkCount,
			publishFailedCount: job.publishFailedCount,
			createdAt: job.createdAt,
			startedAt: job.startedAt,
			finishedAt: job.finishedAt,
			publishStartedAt: job.publishStartedAt,
			publishFinishedAt: job.publishFinishedAt,
			lastError: job.lastError,
			lockExpiresAt: job.lockExpiresAt,
			usageReserved: job.usageReserved,
			usageCount: job.usageCount,
			telemetry: {
				totalAttempts: job.totalAttempts,
				totalRetryWaitMs: job.totalRetryWaitMs
			},
			settingsJson: job.settingsJson ? safeJsonParse(job.settingsJson) : null
		},
		items: job.items.map((it) => ({
			id: it.id,
			productId: it.productId,
			productTitle: it.productTitle,
			status: it.status,
			publishStatus: it.publishStatus,
			startedAt: it.startedAt,
			finishedAt: it.finishedAt,
			publishedAt: it.publishedAt,
			seoTitle: it.seoTitle,
			seoDescription: it.seoDescription,
			error: it.error,
			publishError: it.publishError,
			telemetry: {
				genAttempts: it.genAttempts,
				genRetryWaitMs: it.genRetryWaitMs,
				publishAttempts: it.publishAttempts,
				publishRetryWaitMs: it.publishRetryWaitMs
			}
		}))
	};
	const filename = `debug-report_${job.id}.json`;
	return new Response(JSON.stringify(report, null, 2), { headers: {
		"Content-Type": "application/json; charset=utf-8",
		"Content-Disposition": `attachment; filename=\"${filename}\"`,
		"Cache-Control": "no-store"
	} });
}
function safeJsonParse(str) {
	try {
		return JSON.parse(str);
	} catch {
		return { _parseError: true };
	}
}
//#endregion
//#region app/queue.server.js
var QUEUE_NAME = "seo-jobs";
var JOB_NAME = "process-seo-job";
function getRedisUrl() {
	const url = process.env.REDIS_URL;
	if (!url) throw new Error("REDIS_URL is not set. Cannot enqueue jobs.");
	return url;
}
var _queue = null;
function getQueue() {
	if (_queue) return _queue;
	_queue = new Queue(QUEUE_NAME, { connection: { url: getRedisUrl() } });
	return _queue;
}
/**
* BullMQ custom jobId içinde ':' olamaz.
* Bu yüzden güvenli bir custom id üretiyoruz.
*/
function safeBullId(input) {
	return String(input || "").trim().replace(/[:]/g, "-");
}
/**
* kind: "generate" | "publish" (opsiyonel)
* - Worker bullJob.data.jobId okuyor
* - kind sadece debug/ayrım için data içinde kalsın (jobId stringinde ':' yok)
*/
async function enqueueSeoJob(jobId, kind = "generate") {
	const queue = getQueue();
	const normalizedJobId = String(jobId || "").trim();
	if (!normalizedJobId) throw new Error("enqueueSeoJob(jobId) missing jobId");
	const safeJobId = safeBullId(normalizedJobId);
	const customId = `${safeBullId(kind)}-${safeJobId}`;
	await queue.add(JOB_NAME, {
		jobId: normalizedJobId,
		kind
	}, {
		jobId: customId,
		attempts: 3,
		backoff: {
			type: "exponential",
			delay: 2e3
		},
		removeOnComplete: true,
		removeOnFail: true
	});
}
/**
* Best-effort removal of a queued BullMQ job.
* We use the same deterministic custom jobId format as enqueueSeoJob().
* If the job is already active/completed, BullMQ may not remove it — that's OK.
*/
async function removeSeoQueueJob(jobId, kind = "generate") {
	try {
		const queue = getQueue();
		const normalizedJobId = String(jobId || "").trim();
		if (!normalizedJobId) return {
			ok: false,
			removed: false,
			message: "Missing jobId"
		};
		const safeJobId = safeBullId(normalizedJobId);
		const customId = `${safeBullId(kind)}-${safeJobId}`;
		await queue.remove(customId);
		return {
			ok: true,
			removed: true,
			message: "Removed from queue"
		};
	} catch (e) {
		return {
			ok: false,
			removed: false,
			message: e?.message || String(e)
		};
	}
}
//#endregion
//#region app/jobs.server.js
function sanitizeLanguage$1(input) {
	const m = String(input || "").trim().toLowerCase().match(/^[a-z]{2}/);
	return m ? m[0] : "tr";
}
function newJobId() {
	return `${Date.now()}_${crypto.randomBytes(6).toString("hex")}`;
}
/**
* Generate job oluşturur + job items ekler
*/
async function createGenerateJob({ shop, seed, productIds, productTitlesById = {}, usageReserved = false }) {
	const jobId = newJobId();
	const language = sanitizeLanguage$1(seed?.language);
	const settingsJson = seed?.settings ? JSON.stringify(seed.settings) : null;
	const metaTitle = seed?.fields?.metaTitle !== false;
	const metaDescription = seed?.fields?.metaDescription !== false;
	const itemsCreate = (productIds || []).map((pid) => ({
		targetType: "PRODUCT",
		targetId: String(pid),
		productId: String(pid),
		productTitle: productTitlesById[pid] ? String(productTitlesById[pid]) : null,
		status: "queued"
	}));
	return await prisma.seoJob.create({
		data: {
			id: jobId,
			shop,
			status: "queued",
			jobType: "PRODUCT_SEO",
			total: productIds.length,
			okCount: 0,
			failedCount: 0,
			language,
			settingsJson,
			metaTitle,
			metaDescription,
			usageReserved: Boolean(usageReserved),
			usageCount: Math.max(0, Number(productIds?.length || 0)),
			items: { create: itemsCreate }
		},
		include: { items: true }
	});
}
/**
* Alt text job oluşturur + image items ekler
* - images: [{ productId, productTitle, mediaId, imageUrl, currentAltText }]
* Draft alt text "seoTitle" alanında tutulur.
*/
async function createAltTextJob({ shop, seed, images = [], usageReserved = false }) {
	const jobId = newJobId();
	const language = sanitizeLanguage$1(seed?.language);
	const settingsJson = seed?.settings ? JSON.stringify(seed.settings) : null;
	const itemsCreate = (images || []).map((img) => ({
		targetType: "IMAGE",
		targetId: String(img.mediaId),
		productId: img.productId ? String(img.productId) : null,
		productTitle: img.productTitle ? String(img.productTitle) : null,
		mediaId: String(img.mediaId),
		imageUrl: img.imageUrl ? String(img.imageUrl) : null,
		seoDescription: img.currentAltText ? String(img.currentAltText) : null,
		status: "queued"
	}));
	return await prisma.seoJob.create({
		data: {
			id: jobId,
			shop,
			status: "queued",
			jobType: "ALT_TEXT_IMAGES",
			total: images.length,
			okCount: 0,
			failedCount: 0,
			language,
			settingsJson,
			metaTitle: true,
			metaDescription: false,
			usageReserved: Boolean(usageReserved),
			usageCount: Math.max(0, Number(images?.length || 0)),
			items: { create: itemsCreate }
		},
		include: { items: true }
	});
}
async function createBlogMetaJob({ shop, seed, articles = [], usageReserved = false }) {
	const jobId = newJobId();
	const language = sanitizeLanguage$1(seed?.language);
	const settingsJson = seed?.settings ? JSON.stringify(seed.settings) : null;
	const itemsCreate = (articles || []).map((a) => ({
		targetType: "BLOG_ARTICLE",
		targetId: String(a.articleId),
		productId: String(a.articleId),
		productTitle: a.title ? String(a.title) : null,
		status: "queued"
	}));
	return await prisma.seoJob.create({
		data: {
			id: jobId,
			shop,
			status: "queued",
			jobType: "BLOG_SEO_META",
			total: articles.length,
			okCount: 0,
			failedCount: 0,
			language,
			settingsJson,
			metaTitle: true,
			metaDescription: true,
			usageReserved: Boolean(usageReserved),
			usageCount: Math.max(0, Number(articles?.length || 0)),
			items: { create: itemsCreate }
		},
		include: { items: true }
	});
}
async function getJobsForShop(shop, options = {}) {
	const { limit = 50, cursor = null, status = null, phase = null, jobType = null, q = null, sort = "createdAt_desc" } = options || {};
	const where = { shop };
	const statusNorm = status ? String(status).toLowerCase() : "";
	if (statusNorm) where.status = statusNorm;
	const phaseNorm = phase ? String(phase).toLowerCase() : "";
	if (phaseNorm) where.phase = phaseNorm;
	const jobTypeNorm = jobType ? String(jobType).toUpperCase() : "";
	if (jobTypeNorm) where.jobType = jobTypeNorm;
	const qStr = q ? String(q).trim() : "";
	if (qStr) where.id = { contains: qStr };
	const orderBy = (() => {
		const s = String(sort || "").toLowerCase();
		if (s === "createdat_asc") return { createdAt: "asc" };
		if (s === "status_asc") return [{ status: "asc" }, { createdAt: "desc" }];
		if (s === "status_desc") return [{ status: "desc" }, { createdAt: "desc" }];
		if (s === "phase_asc") return [{ phase: "asc" }, { createdAt: "desc" }];
		if (s === "phase_desc") return [{ phase: "desc" }, { createdAt: "desc" }];
		return { createdAt: "desc" };
	})();
	const take = Math.min(100, Math.max(1, Number(limit) || 50));
	const query = {
		where,
		orderBy,
		take
	};
	if (cursor) {
		query.cursor = { id: String(cursor) };
		query.skip = 1;
	}
	const jobs = await prisma.seoJob.findMany(query);
	return {
		jobs,
		nextCursor: jobs.length === take ? String(jobs[jobs.length - 1].id) : null,
		take
	};
}
/**
* Retry failed items for a job.
* - kind: "generate" | "publish" (optional). If not provided, inferred from job.phase.
* - Resets failed items back to queued and normalizes counters so progress won't exceed total.
* - Re-enqueues the BullMQ job so the worker processes the remaining failed items.
*/
async function retryFailedForJob({ shop, jobId, kind = null }) {
	const job = await prisma.seoJob.findFirst({ where: {
		id: String(jobId || ""),
		shop
	} });
	if (!job) throw new Error("Job not found");
	const phase = String(job.phase || "").toLowerCase();
	if ((kind || (phase === "publishing" || phase === "published" ? "publish" : "generate")) === "publish") {
		const failedItems = await prisma.seoJobItem.count({ where: {
			jobId: job.id,
			publishStatus: "failed"
		} });
		if (!failedItems) return {
			ok: true,
			message: "No failed publish items to retry.",
			kind: "publish"
		};
		await prisma.seoJobItem.updateMany({
			where: {
				jobId: job.id,
				publishStatus: "failed"
			},
			data: {
				publishStatus: "queued",
				publishError: null,
				publishedAt: null
			}
		});
		const publishOk = await prisma.seoJobItem.count({ where: {
			jobId: job.id,
			publishStatus: "success"
		} });
		await prisma.seoJob.update({
			where: { id: job.id },
			data: {
				status: "queued",
				phase: "publishing",
				lastError: null,
				publishOkCount: publishOk,
				publishFailedCount: 0,
				publishStartedAt: null,
				publishFinishedAt: null,
				lockOwner: null,
				lockExpiresAt: null
			}
		});
		await enqueueSeoJob(job.id, "publish");
		return {
			ok: true,
			message: `Retry started for ${failedItems} failed publish item(s).`,
			kind: "publish"
		};
	}
	const failedItems = await prisma.seoJobItem.count({ where: {
		jobId: job.id,
		status: "failed"
	} });
	if (!failedItems) return {
		ok: true,
		message: "No failed generation items to retry.",
		kind: "generate"
	};
	await prisma.seoJobItem.updateMany({
		where: {
			jobId: job.id,
			status: "failed"
		},
		data: {
			status: "queued",
			error: null,
			startedAt: null,
			finishedAt: null
		}
	});
	const ok = await prisma.seoJobItem.count({ where: {
		jobId: job.id,
		status: "success"
	} });
	await prisma.seoJob.update({
		where: { id: job.id },
		data: {
			status: "queued",
			phase: "generating",
			lastError: null,
			okCount: ok,
			failedCount: 0,
			startedAt: null,
			finishedAt: null,
			lockOwner: null,
			lockExpiresAt: null
		}
	});
	await enqueueSeoJob(job.id, "generate");
	return {
		ok: true,
		message: `Retry started for ${failedItems} failed generation item(s).`,
		kind: "generate"
	};
}
/**
* Cancel a job that is queued/running.
* - Marks job.status = "cancelled" (string enum is not enforced in Prisma)
* - Marks remaining queued/running items as failed with a cancel message
* - Clears locks so the worker can move on
* - Best-effort removes BullMQ jobs for both generate/publish
*/
async function cancelJobForShop({ shop, jobId }) {
	const id = String(jobId || "").trim();
	if (!id) return {
		ok: false,
		message: "Missing jobId"
	};
	const job = await prisma.seoJob.findFirst({ where: {
		id,
		shop
	} });
	if (!job) return {
		ok: false,
		message: "Job not found"
	};
	const now = /* @__PURE__ */ new Date();
	const msg = "Cancelled by user";
	const phase = String(job.phase || "generating").toLowerCase();
	const isPublish = phase === "publishing" || phase === "published";
	await removeSeoQueueJob(id, "generate");
	await removeSeoQueueJob(id, "publish");
	await prisma.seoJobItem.updateMany({
		where: {
			jobId: id,
			status: { in: ["queued", "running"] }
		},
		data: {
			status: "failed",
			error: msg,
			finishedAt: now
		}
	});
	await prisma.seoJobItem.updateMany({
		where: {
			jobId: id,
			publishStatus: { in: ["queued", "running"] }
		},
		data: {
			publishStatus: "failed",
			publishError: msg,
			publishedAt: null
		}
	});
	const ok = await prisma.seoJobItem.count({ where: {
		jobId: id,
		status: "success"
	} });
	const failed = await prisma.seoJobItem.count({ where: {
		jobId: id,
		status: "failed"
	} });
	const pok = await prisma.seoJobItem.count({ where: {
		jobId: id,
		publishStatus: "success"
	} });
	const pfailed = await prisma.seoJobItem.count({ where: {
		jobId: id,
		publishStatus: "failed"
	} });
	await prisma.seoJob.update({
		where: { id },
		data: {
			status: "cancelled",
			lastError: msg,
			finishedAt: now,
			phase: isPublish ? "publishing" : "generating",
			okCount: ok,
			failedCount: failed,
			publishOkCount: pok,
			publishFailedCount: pfailed,
			publishFinishedAt: isPublish ? now : job.publishFinishedAt,
			lockOwner: null,
			lockExpiresAt: null
		}
	});
	return {
		ok: true,
		message: "Job cancelled."
	};
}
//#endregion
//#region app/routes/app.generation-history.jsx
var app_generation_history_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$4,
	action: () => action$5,
	default: () => app_generation_history_default,
	loader: () => loader$9
});
/** ---------------- server ---------------- */
async function loader$9({ request }) {
	const { session } = await authenticate.admin(request);
	const url = new URL(request.url);
	const host = url.searchParams.get("host") || "";
	const embedded = url.searchParams.get("embedded") || "";
	const shop = session.shop || "";
	const q = url.searchParams.get("q") || "";
	const status = url.searchParams.get("status") || "";
	const phase = url.searchParams.get("phase") || "";
	const jobType = url.searchParams.get("jobType") || "";
	const sort = url.searchParams.get("sort") || "createdAt_desc";
	const limit = Number(url.searchParams.get("limit") || 50) || 50;
	const cursor = url.searchParams.get("cursor") || null;
	const { jobs, nextCursor, take } = await getJobsForShop(shop, {
		limit,
		cursor,
		status: status || null,
		phase: phase || null,
		jobType: jobType || null,
		q: q || null,
		sort
	});
	return {
		jobs,
		meta: {
			q,
			status,
			phase,
			jobType,
			sort,
			limit: take,
			cursor: cursor ? String(cursor) : "",
			nextCursor: nextCursor || ""
		},
		shop,
		host,
		embedded
	};
}
async function action$5({ request }) {
	const { session } = await authenticate.admin(request);
	const shop = session.shop || "";
	const formData = await request.formData();
	const intent = String(formData.get("_action") || "");
	if (intent === "retry_failed") {
		const jobId = String(formData.get("jobId") || "").trim();
		const kindRaw = String(formData.get("kind") || "").trim();
		const kind = kindRaw ? kindRaw : null;
		if (!jobId) return {
			ok: false,
			message: "Missing jobId"
		};
		return await retryFailedForJob({
			shop,
			jobId,
			kind
		});
	}
	if (intent === "cancel_job") {
		const jobId = String(formData.get("jobId") || "").trim();
		if (!jobId) return {
			ok: false,
			message: "Missing jobId"
		};
		return await cancelJobForShop({
			shop,
			jobId
		});
	}
	if (intent === "clear_history") return {
		ok: true,
		message: `Cleared ${(await prisma.seoJob.deleteMany({ where: { shop } })).count} job(s).`
	};
	return {
		ok: false,
		message: "Unsupported action"
	};
}
/** ---------------- helpers ---------------- */
function formatDate(ts) {
	try {
		return new Date(ts).toLocaleString();
	} catch {
		return "";
	}
}
function normalizePhase$1(phase) {
	return String(phase || "").toLowerCase() || "";
}
function phaseLabel(phase) {
	const p = normalizePhase$1(phase);
	if (p === "generating") return "Generating";
	if (p === "generated") return "Generated";
	if (p === "publishing") return "Publishing";
	if (p === "published") return "Published";
	return p || "-";
}
function normalizeStatus$2(status) {
	return String(status || "").toLowerCase() || "";
}
function statusTone$1(status) {
	const s = normalizeStatus$2(status);
	if (s === "running") return "info";
	if (s === "queued") return "attention";
	if (s === "success") return "success";
	if (s === "failed") return "critical";
	if (s === "cancelled" || s === "canceled") return "subdued";
	return "subdued";
}
function statusLabel(status) {
	const s = normalizeStatus$2(status);
	if (!s) return "-";
	if (s === "cancelled" || s === "canceled") return "Cancelled";
	return s.charAt(0).toUpperCase() + s.slice(1);
}
function jobTypeLabel(jobType) {
	const t = String(jobType || "").toUpperCase();
	if (t === "PRODUCT_SEO") return "Product SEO";
	if (t === "ALT_TEXT_IMAGES") return "Alt Text (Images)";
	if (t === "BLOG_SEO_META") return "Blog SEO Meta";
	if (t === "BLOG_META") return "Blog Meta";
	return t || "-";
}
function getProgress(job) {
	const total = Math.max(0, Number(job?.total ?? 0));
	const phase = normalizePhase$1(job?.phase);
	const status = normalizeStatus$2(job?.status);
	if (!total) return {
		total: 0,
		processed: 0,
		label: "-"
	};
	if (phase === "publishing" || phase === "published") {
		const processed = Number(job?.publishOkCount ?? 0) + Number(job?.publishFailedCount ?? 0);
		const doneLabel = status === "running" || status === "queued" ? `${processed}/${total} Published` : `${total}/${total} Published`;
		return {
			total,
			processed: Math.min(total, Math.max(0, processed)),
			label: doneLabel
		};
	}
	const processed = Number(job?.okCount ?? 0) + Number(job?.failedCount ?? 0);
	const doneLabel = status === "running" || status === "queued" ? `${processed}/${total} Generated` : `${total}/${total} Generated`;
	return {
		total,
		processed: Math.min(total, Math.max(0, processed)),
		label: doneLabel
	};
}
function percent(processed, total) {
	if (!total) return 0;
	const p = Math.round(Number(processed) / Number(total) * 100);
	return Math.max(0, Math.min(100, p));
}
function getEmbeddedQuery(locationSearch, loaderData) {
	const p = new URLSearchParams(locationSearch || "");
	const ss = typeof window !== "undefined" ? window.sessionStorage : null;
	const shop = p.get("shop") || ss?.getItem("shopifyShop") || loaderData?.shop || "";
	const host = p.get("host") || ss?.getItem("shopifyHost") || loaderData?.host || "";
	const embedded = p.get("embedded") || ss?.getItem("shopifyEmbedded") || loaderData?.embedded || "";
	const out = new URLSearchParams();
	if (shop) out.set("shop", shop);
	if (host) out.set("host", host);
	if (embedded) out.set("embedded", embedded);
	const qs = out.toString();
	return qs ? `?${qs}` : "";
}
function buildSearch(locationSearch, patch = {}) {
	const sp = new URLSearchParams(locationSearch || "");
	[
		"shop",
		"host",
		"embedded"
	].forEach((k) => {
		if (patch[k] === void 0 && sp.has(k) === false) return;
		if (patch[k] === null) sp.delete(k);
	});
	Object.entries(patch || {}).forEach(([k, v]) => {
		if (v === void 0) return;
		if (v === null || v === "") sp.delete(k);
		else sp.set(k, String(v));
	});
	if ("q" in patch || "status" in patch || "phase" in patch || "jobType" in patch || "sort" in patch || "limit" in patch) sp.delete("cursor");
	const qs = sp.toString();
	return qs ? `?${qs}` : "";
}
/** ---------------- component ---------------- */
var app_generation_history_default = UNSAFE_withComponentProps(function GenerationHistory() {
	const outlet = useOutlet();
	const isChildRoute = Boolean(outlet);
	const data = useLoaderData();
	const navigate = useNavigate();
	const location = useLocation();
	const poller = useFetcher();
	const actionFetcher = useFetcher();
	const [lastActionKey, setLastActionKey] = useState("");
	const jobs = Array.isArray(data?.jobs) ? data.jobs : [];
	const meta = data?.meta || {};
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (data?.shop) window.sessionStorage.setItem("shopifyShop", data.shop);
		if (data?.host) window.sessionStorage.setItem("shopifyHost", data.host);
		if (data?.embedded) window.sessionStorage.setItem("shopifyEmbedded", data.embedded);
	}, [
		data?.shop,
		data?.host,
		data?.embedded
	]);
	const embeddedQs = useMemo(() => getEmbeddedQuery(location.search, data), [
		location.search,
		data?.shop,
		data?.host,
		data?.embedded
	]);
	const effectiveJobs = useMemo(() => {
		if (poller.data && typeof poller.data === "object" && Array.isArray(poller.data.jobs)) return poller.data.jobs;
		return jobs;
	}, [poller.data, jobs]);
	const effectiveMeta = useMemo(() => {
		if (poller.data && typeof poller.data === "object" && poller.data.meta) return poller.data.meta;
		return meta;
	}, [poller.data, meta]);
	const rows = useMemo(() => {
		return (Array.isArray(effectiveJobs) ? effectiveJobs : []).map((j) => ({
			id: String(j.id),
			createdAt: j.createdAt,
			phase: j.phase,
			status: j.status,
			jobType: j.jobType,
			lastError: j.lastError,
			startedAt: j.startedAt,
			finishedAt: j.finishedAt,
			publishStartedAt: j.publishStartedAt,
			publishFinishedAt: j.publishFinishedAt,
			total: j.total,
			okCount: j.okCount,
			failedCount: j.failedCount,
			publishOkCount: j.publishOkCount,
			publishFailedCount: j.publishFailedCount
		}));
	}, [effectiveJobs]);
	const hasActive = useMemo(() => {
		return rows.some((r) => {
			const s = normalizeStatus$2(r.status);
			return s === "queued" || s === "running";
		});
	}, [rows]);
	const isLatestPage = useMemo(() => {
		return !new URLSearchParams(location.search || "").get("cursor");
	}, [location.search]);
	useEffect(() => {
		if (isChildRoute) return;
		if (!hasActive) return;
		if (!isLatestPage) return;
		const t = setInterval(() => {
			poller.load(`${location.pathname}${location.search || ""}`);
		}, 2500);
		return () => clearInterval(t);
	}, [
		isChildRoute,
		hasActive,
		isLatestPage,
		poller,
		location.pathname,
		location.search
	]);
	useEffect(() => {
		if (isChildRoute) return;
		if (actionFetcher.state !== "idle") return;
		if (!actionFetcher.data?.ok) return;
		if (lastActionKey !== "clear_history") return;
		poller.load(`${location.pathname}${location.search || ""}`);
	}, [
		isChildRoute,
		actionFetcher.state,
		actionFetcher.data,
		lastActionKey,
		poller,
		location.pathname,
		location.search
	]);
	/** -------- IndexFilters state (read from URL) -------- */
	const [mode, setMode] = useState(IndexFiltersMode.Default);
	const [queryValue, setQueryValue] = useState(() => String(effectiveMeta?.q || ""));
	useEffect(() => {
		if (isChildRoute) return;
		setQueryValue(String(effectiveMeta?.q || ""));
	}, [isChildRoute, effectiveMeta?.q]);
	useEffect(() => {
		if (isChildRoute) return;
		const t = setTimeout(() => {
			navigate(`${location.pathname}${buildSearch(location.search, { q: queryValue || "" })}`, { replace: true });
		}, 400);
		return () => clearTimeout(t);
	}, [isChildRoute, queryValue]);
	const appliedFilters = useMemo(() => {
		const out = [];
		if (effectiveMeta?.status) out.push({
			key: "status",
			label: `Status: ${statusLabel(effectiveMeta.status)}`,
			onRemove: () => navigate(`${location.pathname}${buildSearch(location.search, { status: "" })}`)
		});
		if (effectiveMeta?.phase) out.push({
			key: "phase",
			label: `Phase: ${phaseLabel(effectiveMeta.phase)}`,
			onRemove: () => navigate(`${location.pathname}${buildSearch(location.search, { phase: "" })}`)
		});
		if (effectiveMeta?.jobType) out.push({
			key: "jobType",
			label: `Type: ${jobTypeLabel(effectiveMeta.jobType)}`,
			onRemove: () => navigate(`${location.pathname}${buildSearch(location.search, { jobType: "" })}`)
		});
		return out;
	}, [
		effectiveMeta?.status,
		effectiveMeta?.phase,
		effectiveMeta?.jobType,
		navigate,
		location.pathname,
		location.search
	]);
	const filters = useMemo(() => {
		return [
			{
				key: "status",
				label: "Status",
				filter: /* @__PURE__ */ jsx(ChoiceList, {
					title: "Status",
					titleHidden: true,
					choices: [
						{
							label: "All",
							value: ""
						},
						{
							label: "Queued",
							value: "queued"
						},
						{
							label: "Running",
							value: "running"
						},
						{
							label: "Success",
							value: "success"
						},
						{
							label: "Failed",
							value: "failed"
						},
						{
							label: "Cancelled",
							value: "cancelled"
						}
					],
					selected: [String(effectiveMeta?.status || "")],
					onChange: (selected) => {
						const v = Array.isArray(selected) ? selected[0] : "";
						navigate(`${location.pathname}${buildSearch(location.search, { status: v })}`);
					}
				}),
				shortcut: true
			},
			{
				key: "phase",
				label: "Phase",
				filter: /* @__PURE__ */ jsx(ChoiceList, {
					title: "Phase",
					titleHidden: true,
					choices: [
						{
							label: "All",
							value: ""
						},
						{
							label: "Generating",
							value: "generating"
						},
						{
							label: "Generated",
							value: "generated"
						},
						{
							label: "Publishing",
							value: "publishing"
						},
						{
							label: "Published",
							value: "published"
						}
					],
					selected: [String(effectiveMeta?.phase || "")],
					onChange: (selected) => {
						const v = Array.isArray(selected) ? selected[0] : "";
						navigate(`${location.pathname}${buildSearch(location.search, { phase: v })}`);
					}
				})
			},
			{
				key: "jobType",
				label: "Type",
				filter: /* @__PURE__ */ jsx(ChoiceList, {
					title: "Type",
					titleHidden: true,
					choices: [
						{
							label: "All",
							value: ""
						},
						{
							label: "Product SEO",
							value: "PRODUCT_SEO"
						},
						{
							label: "Alt Text (Images)",
							value: "ALT_TEXT_IMAGES"
						},
						{
							label: "Blog Meta",
							value: "BLOG_META"
						},
						{
							label: "Blog SEO Meta",
							value: "BLOG_SEO_META"
						}
					],
					selected: [String(effectiveMeta?.jobType || "")],
					onChange: (selected) => {
						const v = Array.isArray(selected) ? selected[0] : "";
						navigate(`${location.pathname}${buildSearch(location.search, { jobType: v })}`);
					}
				})
			}
		];
	}, [
		effectiveMeta?.status,
		effectiveMeta?.phase,
		effectiveMeta?.jobType,
		navigate,
		location.pathname,
		location.search
	]);
	const sortOptions = useMemo(() => {
		return [
			{
				label: "Newest",
				value: "createdAt_desc"
			},
			{
				label: "Oldest",
				value: "createdAt_asc"
			},
			{
				label: "Status (A→Z)",
				value: "status_asc"
			},
			{
				label: "Status (Z→A)",
				value: "status_desc"
			},
			{
				label: "Phase (A→Z)",
				value: "phase_asc"
			},
			{
				label: "Phase (Z→A)",
				value: "phase_desc"
			}
		];
	}, []);
	const onQueryChange = useCallback((v) => setQueryValue(v), []);
	const onQueryClear = useCallback(() => setQueryValue(""), []);
	const onClearAll = useCallback(() => {
		const sp = new URLSearchParams(location.search || "");
		[
			"q",
			"status",
			"phase",
			"jobType",
			"sort",
			"cursor"
		].forEach((k) => sp.delete(k));
		navigate(`${location.pathname}?${sp.toString()}`);
	}, [
		navigate,
		location.pathname,
		location.search
	]);
	/** -------- table markup -------- */
	const rowMarkup = rows.map((job, index) => {
		const tone = statusTone$1(job.status);
		const p = getProgress(job);
		const v = percent(p.processed, p.total);
		const phase = normalizePhase$1(job.phase);
		const isPublishPhase = phase === "publishing" || phase === "published";
		const canRetry = (isPublishPhase ? Number(job?.publishFailedCount || 0) : Number(job?.failedCount || 0)) > 0 && !["running", "queued"].includes(normalizeStatus$2(job.status));
		const retryKind = isPublishPhase ? "publish" : "generate";
		const retryLoading = actionFetcher.state !== "idle" && lastActionKey === `retry:${job.id}`;
		const canCancel = ["running", "queued"].includes(normalizeStatus$2(job.status));
		const cancelLoading = actionFetcher.state !== "idle" && lastActionKey === `cancel:${job.id}`;
		const to = `/app/generation-history/${encodeURIComponent(job.id)}${embeddedQs}`;
		return /* @__PURE__ */ jsxs(IndexTable.Row, {
			id: job.id,
			position: index,
			children: [
				/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Text, {
					as: "span",
					variant: "bodyMd",
					fontWeight: "semibold",
					children: formatDate(job.createdAt)
				}) }),
				/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Badge, {
					tone: "subdued",
					children: jobTypeLabel(job.jobType)
				}) }),
				/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Badge, {
					tone: "subdued",
					children: phaseLabel(job.phase)
				}) }),
				/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Badge, {
					tone,
					children: statusLabel(job.status)
				}) }),
				/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsxs(BlockStack, {
					gap: "200",
					children: [/* @__PURE__ */ jsx(Text, {
						as: "span",
						variant: "bodySm",
						tone: "subdued",
						children: p.label
					}), /* @__PURE__ */ jsx(ProgressBar, { progress: v })]
				}) }),
				/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx("span", {
					onMouseDownCapture: (e) => e.stopPropagation(),
					onClickCapture: (e) => e.stopPropagation(),
					style: { display: "inline-block" },
					children: /* @__PURE__ */ jsxs(InlineStack, {
						gap: "200",
						children: [
							/* @__PURE__ */ jsx(Link, {
								to,
								style: { textDecoration: "none" },
								onClick: (e) => e.stopPropagation(),
								children: /* @__PURE__ */ jsx(Button, {
									size: "slim",
									children: "View"
								})
							}),
							canRetry ? /* @__PURE__ */ jsx(Button, {
								size: "slim",
								variant: "secondary",
								loading: retryLoading,
								onClick: (e) => {
									e.stopPropagation();
									setLastActionKey(`retry:${job.id}`);
									actionFetcher.submit({
										_action: "retry_failed",
										jobId: job.id,
										kind: retryKind
									}, { method: "post" });
								},
								children: "Retry failed"
							}) : null,
							canCancel ? /* @__PURE__ */ jsx(Button, {
								size: "slim",
								tone: "critical",
								loading: cancelLoading,
								onClick: (e) => {
									e.stopPropagation();
									setLastActionKey(`cancel:${job.id}`);
									actionFetcher.submit({
										_action: "cancel_job",
										jobId: job.id
									}, { method: "post" });
								},
								children: "Cancel"
							}) : null
						]
					})
				}) })
			]
		}, job.id);
	});
	const nextCursor = String(effectiveMeta?.nextCursor || "");
	const hasNext = Boolean(nextCursor);
	if (isChildRoute) return outlet;
	return /* @__PURE__ */ jsx(Page, {
		title: "Generation History",
		fullWidth: true,
		children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, {
			gap: "400",
			children: [
				actionFetcher.data?.message ? /* @__PURE__ */ jsx(Banner, {
					tone: actionFetcher.data?.ok ? "success" : "critical",
					children: /* @__PURE__ */ jsx(Text, {
						as: "p",
						variant: "bodyMd",
						children: actionFetcher.data.message
					})
				}) : null,
				/* @__PURE__ */ jsxs(InlineStack, {
					align: "space-between",
					blockAlign: "center",
					children: [/* @__PURE__ */ jsx(Text, {
						as: "h2",
						variant: "headingMd",
						children: "Jobs"
					}), /* @__PURE__ */ jsxs(InlineStack, {
						gap: "200",
						children: [
							/* @__PURE__ */ jsx(Button, {
								onClick: () => poller.load(`${location.pathname}${location.search || ""}`),
								loading: poller.state !== "idle",
								children: "Refresh"
							}),
							/* @__PURE__ */ jsx(Button, {
								tone: "critical",
								variant: "secondary",
								onClick: () => {
									if (!(typeof window !== "undefined" && window.confirm("Clear all history? This will delete all jobs for this store."))) return;
									setLastActionKey("clear_history");
									actionFetcher.submit({ _action: "clear_history" }, { method: "post" });
								},
								children: "Clear history"
							}),
							!isLatestPage ? /* @__PURE__ */ jsx(Button, {
								variant: "secondary",
								onClick: () => navigate(`${location.pathname}${buildSearch(location.search, { cursor: "" })}`),
								children: "Back to latest"
							}) : null
						]
					})]
				}),
				/* @__PURE__ */ jsx(IndexFilters, {
					mode,
					setMode,
					queryValue,
					queryPlaceholder: "Search job id...",
					onQueryChange,
					onQueryClear,
					filters,
					appliedFilters,
					onClearAll,
					sortOptions,
					sortSelected: [String(effectiveMeta?.sort || "createdAt_desc")],
					onSort: (selected) => {
						const v = Array.isArray(selected) ? selected[0] : "createdAt_desc";
						navigate(`${location.pathname}${buildSearch(location.search, { sort: v })}`);
					},
					tabs: [{
						id: "all",
						content: "All",
						isLocked: true
					}],
					selected: 0,
					onSelect: () => {},
					canCreateNewView: false
				}),
				/* @__PURE__ */ jsx(IndexTable, {
					resourceName: {
						singular: "job",
						plural: "jobs"
					},
					itemCount: rows.length,
					headings: [
						{ title: "Created" },
						{ title: "Type" },
						{ title: "Phase" },
						{ title: "Status" },
						{ title: "Progress" },
						{ title: "" }
					],
					selectable: false,
					children: rowMarkup
				}),
				rows.length === 0 ? /* @__PURE__ */ jsx(Text, {
					as: "p",
					variant: "bodyMd",
					tone: "subdued",
					children: "No jobs found."
				}) : null,
				hasNext ? /* @__PURE__ */ jsx(InlineStack, {
					align: "center",
					children: /* @__PURE__ */ jsx(Button, {
						variant: "secondary",
						onClick: () => navigate(`${location.pathname}${buildSearch(location.search, { cursor: nextCursor })}`),
						children: "Load older"
					})
				}) : null
			]
		}) }) }) })
	});
});
/** ---------------- route ErrorBoundary ---------------- */
var ErrorBoundary$4 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const err = useRouteError();
	console.error("Generation History ErrorBoundary:", err);
	let bannerTitle = "Something went wrong";
	let message = "Unknown error";
	if (isRouteErrorResponse(err)) {
		bannerTitle = `Error ${err.status}`;
		message = err.data || err.statusText;
	} else if (err instanceof Error) message = err.message;
	else message = String(err);
	if (isChildRoute) return outlet;
	return /* @__PURE__ */ jsx(Page, {
		title: "Generation History",
		fullWidth: true,
		children: /* @__PURE__ */ jsx(Banner, {
			tone: "critical",
			title: bannerTitle,
			children: /* @__PURE__ */ jsx(Text, {
				as: "p",
				variant: "bodyMd",
				children: message
			})
		})
	});
});
//#endregion
//#region app/routes/app.generation-history.$jobId.jsx
var app_generation_history_$jobId_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$3,
	action: () => action$4,
	default: () => app_generation_history_$jobId_default,
	loader: () => loader$8
});
var SETTINGS_NAMESPACE$3 = "ai_seo_assistant";
var SETTINGS_KEY$3 = "settings";
async function getSettingsFromMetafield$3(admin) {
	const raw = (await (await admin.graphql(`#graphql
    query GetAiSeoAssistantSettings($namespace: String!, $key: String!) {
      shop {
        metafield(namespace: $namespace, key: $key) { value }
      }
    }`, { variables: {
		namespace: SETTINGS_NAMESPACE$3,
		key: SETTINGS_KEY$3
	} })).json())?.data?.shop?.metafield?.value;
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
/** ---------------- time helpers ---------------- */
function nowIso() {
	return (/* @__PURE__ */ new Date()).toISOString();
}
function toMs(iso) {
	try {
		return iso ? new Date(iso).getTime() : 0;
	} catch {
		return 0;
	}
}
function safeParse$1(json, fallback) {
	try {
		return JSON.parse(json);
	} catch {
		return fallback;
	}
}
/** ---------------- preview & quality helpers ---------------- */
function clampText(s, max) {
	const str = String(s ?? "");
	if (!max || max <= 0) return str;
	return str.length > max ? str.slice(0, Math.max(0, max - 1)) + "…" : str;
}
function splitCsv(s) {
	return String(s || "").split(",").map((x) => x.trim()).filter(Boolean);
}
function includesAll(text, terms) {
	const t = String(text || "").toLowerCase();
	return (terms || []).every((w) => t.includes(String(w).toLowerCase()));
}
function includesAny(text, terms) {
	const t = String(text || "").toLowerCase();
	return (terms || []).some((w) => t.includes(String(w).toLowerCase()));
}
function computeQuality({ title, desc, settings }) {
	const maxTitle = Number(settings?.seoTitleMaxChars || 60);
	const maxDesc = Number(settings?.seoDescriptionMaxChars || 160);
	const required = splitCsv(settings?.requiredKeywords);
	const banned = splitCsv(settings?.bannedWords);
	const target = String(settings?.targetKeyword || "").trim();
	const combined = `${title || ""} ${desc || ""}`.trim();
	const checks = [
		{
			key: "title_len",
			label: `Title length ≤ ${maxTitle}`,
			ok: String(title || "").length > 0 && String(title || "").length <= maxTitle
		},
		{
			key: "desc_len",
			label: `Description length ≤ ${maxDesc}`,
			ok: String(desc || "").length > 0 && String(desc || "").length <= maxDesc
		},
		...target ? [{
			key: "target_kw",
			label: `Includes target keyword: ${target}`,
			ok: includesAny(combined, [target])
		}] : [],
		...required.length ? [{
			key: "required_kws",
			label: `Includes required keywords (${required.length})`,
			ok: includesAll(combined, required)
		}] : [],
		...banned.length ? [{
			key: "banned",
			label: `Avoids banned words (${banned.length})`,
			ok: !includesAny(combined, banned)
		}] : []
	];
	let score = 100;
	const failed = checks.filter((c) => !c.ok).length;
	score -= failed * 15;
	const t = String(title || "");
	if (t && t === t.toUpperCase() && /[A-ZÇĞİÖŞÜ]/.test(t)) score -= 10;
	if (t.length > maxTitle) score -= Math.min(20, t.length - maxTitle);
	const d = String(desc || "");
	if (d.length > maxDesc) score -= Math.min(20, d.length - maxDesc);
	score = Math.max(0, Math.min(100, Math.round(score)));
	return {
		score,
		checks,
		maxTitle,
		maxDesc
	};
}
/** ---------------- ID normalization ---------------- */
function toProductGid(id) {
	if (!id) return "";
	const s = String(id).trim();
	if (s.startsWith("gid://")) return s;
	const m = s.match(/\/Product\/(\d+)$/);
	if (m?.[1]) return `gid://shopify/Product/${m[1]}`;
	if (/^\d+$/.test(s)) return `gid://shopify/Product/${s}`;
	return s;
}
function toArticleGid(id) {
	if (!id) return "";
	const s = String(id).trim();
	if (s.startsWith("gid://")) return s;
	const m = s.match(/\/Article\/(\d+)$/);
	if (m?.[1]) return `gid://shopify/Article/${m[1]}`;
	if (/^\d+$/.test(s)) return `gid://shopify/Article/${s}`;
	return s;
}
function gidToNumeric(id) {
	if (!id) return "";
	const s = String(id).trim();
	if (/^\d+$/.test(s)) return s;
	const m = s.match(/\/Product\/(\d+)$/);
	return m?.[1] ? String(m[1]) : "";
}
function productIdVariants(rawId) {
	const gid = toProductGid(rawId);
	const num = gidToNumeric(rawId);
	const out = /* @__PURE__ */ new Set();
	if (rawId) out.add(String(rawId).trim());
	if (gid) out.add(gid);
	if (num) out.add(num);
	return Array.from(out).filter(Boolean);
}
/** ---------------- publish status normalize ---------------- */
function isPublishRunningStatus(ps) {
	const s = String(ps || "").toLowerCase();
	return s === "running" || s === "publishing" || s === "in_progress" || s === "processing";
}
function isPublishSuccessStatus(ps) {
	const s = String(ps || "").toLowerCase();
	return s === "success" || s === "published" || s === "completed" || s === "done" || s === "succeeded" || s === "ok";
}
/** ---------------- Shopify live SEO helper ---------------- */
/** ---------------- Shopify live Article SEO helper (metafields) ---------------- */
async function fetchLiveArticleSeo(admin, articleIds) {
	const ids = Array.from(new Set((articleIds || []).map(toArticleGid).filter(Boolean)));
	if (!ids.length) return {};
	const nodes = (await (await admin.graphql(`#graphql
    query ArticlesSeo($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Article {
          id
          titleTag: metafield(namespace: "global", key: "title_tag") { value }
          descriptionTag: metafield(namespace: "global", key: "description_tag") { value }
        }
      }
    }`, { variables: { ids } })).json())?.data?.nodes || [];
	const map = {};
	for (const n of nodes) {
		const gid = n?.id ? String(n.id) : "";
		if (!gid) continue;
		map[gid] = {
			seoTitle: n?.titleTag?.value ?? "",
			seoDescription: n?.descriptionTag?.value ?? ""
		};
	}
	return map;
}
async function fetchLiveProductSeo(admin, productIds) {
	const ids = Array.from(new Set((productIds || []).map(toProductGid).filter(Boolean)));
	if (!ids.length) return {};
	const nodes = (await (await admin.graphql(`#graphql
    query ProductsSeo($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          seo { title description }
        }
      }
    }`, { variables: { ids } })).json())?.data?.nodes || [];
	const map = {};
	for (const n of nodes) {
		const gid = n?.id ? String(n.id) : "";
		if (!gid) continue;
		map[gid] = {
			seoTitle: n?.seo?.title ?? "",
			seoDescription: n?.seo?.description ?? ""
		};
	}
	return map;
}
/** ---------------- embedded query helper ---------------- */
function buildEmbeddedSearch(currentSearch) {
	const p = new URLSearchParams(currentSearch || "");
	const shop = p.get("shop") || (typeof window !== "undefined" ? window.sessionStorage.getItem("shopifyShop") : "") || "";
	const host = p.get("host") || (typeof window !== "undefined" ? window.sessionStorage.getItem("shopifyHost") : "") || "";
	const embedded = p.get("embedded") || (typeof window !== "undefined" ? window.sessionStorage.getItem("shopifyEmbedded") : "") || "";
	const out = new URLSearchParams();
	if (shop) out.set("shop", shop);
	if (host) out.set("host", host);
	if (embedded) out.set("embedded", embedded);
	const qs = out.toString();
	return qs ? `?${qs}` : "";
}
/** ---------------- server ---------------- */
async function loader$8({ request, params }) {
	const { admin, session } = await authenticate.admin(request);
	const jobId = String(params.jobId || "");
	const job = await prisma.seoJob.findFirst({
		where: {
			id: jobId,
			shop: session.shop
		},
		include: { items: true }
	});
	if (!job) throw new Response("Not found", { status: 404 });
	const isImageJob = String(job.jobType || "PRODUCT_SEO") === "ALT_TEXT_IMAGES";
	const isBlogJob = String(job.jobType || "PRODUCT_SEO") === "BLOG_SEO_META";
	const productIds = isImageJob || isBlogJob ? [] : (job.items || []).map((it) => toProductGid(it.productId)).filter(Boolean);
	const articleIds = isBlogJob ? (job.items || []).map((it) => String(it.targetId || it.productId || "")).filter(Boolean) : [];
	return {
		job,
		liveSeoMap: isImageJob ? {} : isBlogJob ? await fetchLiveArticleSeo(admin, articleIds) : await fetchLiveProductSeo(admin, productIds),
		settings: await getSettingsFromMetafield$3(admin)
	};
}
/** ---------------- action ---------------- */
async function action$4({ request, params }) {
	const { admin, session } = await authenticate.admin(request);
	const jobId = String(params.jobId || "");
	const formData = await request.formData();
	const intent = String(formData.get("intent") || "");
	const job = await prisma.seoJob.findFirst({ where: {
		id: jobId,
		shop: session.shop
	} });
	if (!job) throw new Response("Not found", { status: 404 });
	const isImageJob = String(job.jobType || "PRODUCT_SEO") === "ALT_TEXT_IMAGES";
	const isBlogJob = String(job.jobType || "PRODUCT_SEO") === "BLOG_SEO_META";
	if (intent === "retry_job_generate") {
		await prisma.$transaction([prisma.seoJobItem.updateMany({
			where: {
				jobId,
				status: { notIn: ["success"] }
			},
			data: {
				status: "queued",
				error: null
			}
		}), prisma.seoJob.update({
			where: { id: jobId },
			data: {
				phase: "generating",
				status: "queued",
				startedAt: /* @__PURE__ */ new Date(),
				finishedAt: null,
				okCount: 0,
				failedCount: 0,
				lastError: null,
				lastHeartbeatAt: /* @__PURE__ */ new Date()
			}
		})]);
		await enqueueSeoJob(jobId, "generate");
		return {
			ok: true,
			intent: "retry_job_generate"
		};
	}
	if (intent === "retry_job_publish") {
		await prisma.$transaction([prisma.seoJobItem.updateMany({
			where: {
				jobId,
				publishStatus: { in: [
					"failed",
					"queued",
					"running"
				] }
			},
			data: {
				publishStatus: "queued",
				publishError: null
			}
		}), prisma.seoJob.update({
			where: { id: jobId },
			data: {
				phase: "publishing",
				status: "queued",
				publishStartedAt: /* @__PURE__ */ new Date(),
				publishFinishedAt: null,
				publishOkCount: 0,
				publishFailedCount: 0,
				lastError: null,
				lastHeartbeatAt: /* @__PURE__ */ new Date()
			}
		})]);
		await enqueueSeoJob(jobId, "publish");
		return {
			ok: true,
			intent: "retry_job_publish"
		};
	}
	if (intent === "save_draft_selected") {
		const items = safeParse$1(String(formData.get("items") || "[]"), []);
		const valid = Array.isArray(items) ? items.map((x) => ({
			id: String(x?.id || "").trim(),
			productId: String(x?.productId || "").trim(),
			seoTitle: x?.seoTitle == null ? null : String(x.seoTitle),
			seoDescription: x?.seoDescription == null ? null : String(x.seoDescription)
		})).filter((x) => isImageJob ? x.id : x.productId) : [];
		if (!valid.length) return {
			ok: false,
			error: "No items selected"
		};
		if (isImageJob) {
			await prisma.$transaction(valid.map((v) => prisma.seoJobItem.updateMany({
				where: {
					jobId,
					id: v.id
				},
				data: { seoTitle: v.seoTitle }
			})));
			return {
				ok: true,
				intent: "save_draft_selected",
				saved: valid.map((v) => v.id)
			};
		}
		await prisma.$transaction(valid.map((v) => prisma.seoJobItem.updateMany({
			where: {
				jobId,
				productId: v.productId
			},
			data: {
				seoTitle: v.seoTitle,
				seoDescription: v.seoDescription
			}
		})));
		return {
			ok: true,
			intent: "save_draft_selected",
			saved: valid.map((v) => v.productId)
		};
	}
	if (intent === "publish_selected") {
		const items = safeParse$1(String(formData.get("items") || "[]"), []);
		const valid = Array.isArray(items) ? items.map((x) => ({
			id: String(x?.id || "").trim(),
			productId: String(x?.productId || "").trim(),
			seoTitle: x?.seoTitle == null ? null : String(x.seoTitle),
			seoDescription: x?.seoDescription == null ? null : String(x.seoDescription)
		})).filter((x) => isImageJob ? x.id : x.productId) : [];
		if (!valid.length) return {
			ok: false,
			error: "No items selected"
		};
		const onlyChanged = String(formData.get("onlyChanged") || "true") === "true";
		if (isImageJob) {
			let filtered = valid;
			if (onlyChanged) {
				const rows = await prisma.seoJobItem.findMany({
					where: {
						jobId,
						id: { in: valid.map((v) => v.id) }
					},
					select: {
						id: true,
						seoDescription: true
					}
				});
				const curMap = Object.fromEntries(rows.map((r) => [String(r.id), String(r.seoDescription || "")]));
				filtered = valid.filter((v) => String(v.seoTitle || "").trim() !== String(curMap[v.id] || "").trim());
			}
			if (!filtered.length) return {
				ok: false,
				error: onlyChanged ? "No changes to apply" : "No items selected"
			};
			const selectedIds = Array.from(new Set(filtered.map((v) => v.id)));
			await prisma.$transaction([
				prisma.seoJobItem.updateMany({
					where: { jobId },
					data: {
						publishStatus: "skipped",
						publishError: null
					}
				}),
				prisma.seoJobItem.updateMany({
					where: {
						jobId,
						id: { in: selectedIds }
					},
					data: {
						publishStatus: "queued",
						publishError: null,
						publishedAt: null
					}
				}),
				...filtered.map((it) => prisma.seoJobItem.updateMany({
					where: {
						jobId,
						id: it.id
					},
					data: { seoTitle: it.seoTitle }
				}))
			]);
			await prisma.seoJob.update({
				where: { id: jobId },
				data: {
					phase: "publishing",
					status: "queued",
					publishStartedAt: /* @__PURE__ */ new Date(),
					publishFinishedAt: null,
					publishOkCount: 0,
					publishFailedCount: 0,
					lastError: null
				}
			});
			await enqueueSeoJob(jobId, "publish");
			return { ok: true };
		}
		if (isBlogJob) {
			let filtered = valid;
			if (onlyChanged) {
				const liveMap = await fetchLiveArticleSeo(admin, Array.from(new Set(valid.map((v) => toArticleGid(v.productId)).filter(Boolean))));
				filtered = valid.filter((v) => {
					const gid = toArticleGid(v.productId);
					const live = liveMap?.[gid];
					if (!live) return true;
					const nextTitle = String(v.seoTitle ?? "");
					const nextDesc = String(v.seoDescription ?? "");
					const curTitle = String(live.seoTitle ?? "");
					const curDesc = String(live.seoDescription ?? "");
					return nextTitle.trim() !== curTitle.trim() || nextDesc.trim() !== curDesc.trim();
				});
			}
			if (!filtered.length) return {
				ok: false,
				error: onlyChanged ? "No changes to apply" : "No items selected"
			};
			const selectedIds = Array.from(new Set(filtered.map((v) => v.productId)));
			await prisma.$transaction([
				prisma.seoJobItem.updateMany({
					where: { jobId },
					data: {
						publishStatus: "skipped",
						publishError: null
					}
				}),
				prisma.seoJobItem.updateMany({
					where: {
						jobId,
						productId: { in: selectedIds }
					},
					data: {
						publishStatus: "queued",
						publishError: null,
						publishedAt: null
					}
				}),
				...filtered.map((it) => prisma.seoJobItem.updateMany({
					where: {
						jobId,
						productId: it.productId
					},
					data: {
						seoTitle: it.seoTitle,
						seoDescription: it.seoDescription
					}
				}))
			]);
			await prisma.seoJob.update({
				where: { id: jobId },
				data: {
					phase: "publishing",
					status: "queued",
					publishStartedAt: /* @__PURE__ */ new Date(),
					publishFinishedAt: null,
					publishOkCount: 0,
					publishFailedCount: 0,
					lastError: null
				}
			});
			await enqueueSeoJob(jobId, "publish");
			return { ok: true };
		}
		let filtered = valid;
		if (onlyChanged) {
			const liveMap = await fetchLiveProductSeo(admin, Array.from(new Set(valid.map((v) => toProductGid(v.productId)).filter(Boolean))));
			filtered = valid.filter((v) => {
				const gid = toProductGid(v.productId);
				const live = liveMap?.[gid];
				if (!live) return true;
				const nextTitle = String(v.seoTitle ?? "");
				const nextDesc = String(v.seoDescription ?? "");
				const curTitle = String(live.seoTitle ?? "");
				const curDesc = String(live.seoDescription ?? "");
				const titleChanged = nextTitle.trim() !== curTitle.trim();
				const descChanged = nextDesc.trim() !== curDesc.trim();
				const mt = Boolean(job?.metaTitle ?? true);
				const md = Boolean(job?.metaDescription ?? true);
				return (mt ? titleChanged : false) || (md ? descChanged : false);
			});
		}
		if (!filtered.length) return {
			ok: false,
			error: onlyChanged ? "No changes to apply" : "No items selected"
		};
		const selectedAllIds = Array.from(new Set(filtered.flatMap((v) => productIdVariants(v.productId))));
		await prisma.$transaction([
			prisma.seoJobItem.updateMany({
				where: { jobId },
				data: {
					publishStatus: "skipped",
					publishError: null
				}
			}),
			prisma.seoJobItem.updateMany({
				where: {
					jobId,
					productId: { in: selectedAllIds }
				},
				data: {
					publishStatus: "queued",
					publishError: null,
					publishedAt: null
				}
			}),
			...filtered.map((it) => {
				const ids = productIdVariants(it.productId);
				return prisma.seoJobItem.updateMany({
					where: {
						jobId,
						productId: { in: ids }
					},
					data: {
						seoTitle: it.seoTitle,
						seoDescription: it.seoDescription
					}
				});
			})
		]);
		await prisma.seoJob.update({
			where: { id: jobId },
			data: {
				phase: "publishing",
				status: "queued",
				publishStartedAt: /* @__PURE__ */ new Date(),
				publishFinishedAt: null,
				publishOkCount: 0,
				publishFailedCount: 0,
				lastError: null
			}
		});
		await enqueueSeoJob(jobId, "publish");
		return {
			ok: true,
			intent: "publish_selected",
			queued: filtered.length,
			skipped: Math.max(0, valid.length - filtered.length)
		};
	}
	if (intent === "regenerate_selected" || intent === "regenerate_failed") {
		const maybe = safeParse$1(String(formData.get("items") || "[]"), []);
		let productIds = Array.isArray(maybe) ? maybe.map((x) => String(x?.productId || x || "").trim()).filter(Boolean) : [];
		if (intent === "regenerate_failed" && !productIds.length) productIds = (await prisma.seoJobItem.findMany({
			where: {
				jobId,
				status: "failed"
			},
			select: { productId: true }
		})).map((f) => String(f.productId));
		if (!productIds.length) return {
			ok: false,
			error: intent === "regenerate_failed" ? "No failed items" : "No items selected"
		};
		const reservation = await reserveIfFreePlan({
			shop: session.shop,
			productCount: productIds.length
		});
		if (!reservation.ok) return {
			ok: false,
			code: reservation.code || "FREE_LIMIT_EXCEEDED",
			error: "Free plan limit exceeded",
			billing: reservation
		};
		const seedSettings = safeParse$1(String(job.settingsJson || "{}"), {});
		const titlesById = {};
		const rows = await prisma.seoJobItem.findMany({
			where: {
				jobId,
				productId: { in: productIds }
			},
			select: {
				productId: true,
				productTitle: true
			}
		});
		for (const r of rows) if (r?.productId && r?.productTitle) titlesById[String(r.productId)] = String(r.productTitle);
		const newJob = await createGenerateJob({
			shop: session.shop,
			seed: {
				language: String(job.language || "tr"),
				settings: seedSettings,
				fields: {
					metaTitle: Boolean(job.metaTitle ?? true),
					metaDescription: Boolean(job.metaDescription ?? true)
				}
			},
			usageReserved: true,
			productIds,
			productTitlesById: titlesById
		});
		await enqueueSeoJob(newJob.id, "generate");
		return {
			ok: true,
			intent,
			newJobId: newJob.id
		};
	}
	if (intent === "retry_failed_publish") {
		const maybe = safeParse$1(String(formData.get("items") || "[]"), []);
		let productIds = Array.isArray(maybe) ? maybe.map((x) => String(x?.productId || x || "").trim()).filter(Boolean) : [];
		if (!productIds.length) productIds = (await prisma.seoJobItem.findMany({
			where: {
				jobId,
				publishStatus: "failed"
			},
			select: { productId: true }
		})).map((f) => String(f.productId));
		if (!productIds.length) return {
			ok: false,
			error: "No failed items to retry"
		};
		const idsAll = Array.from(new Set(productIds.flatMap((p) => productIdVariants(p))));
		const failedCount = await prisma.seoJobItem.count({ where: {
			jobId,
			productId: { in: idsAll },
			publishStatus: "failed"
		} });
		await prisma.$transaction([prisma.seoJobItem.updateMany({
			where: {
				jobId,
				productId: { in: idsAll }
			},
			data: {
				publishStatus: "queued",
				publishError: null,
				publishedAt: null
			}
		}), prisma.seoJob.update({
			where: { id: jobId },
			data: {
				status: "queued",
				phase: "publishing",
				publishFinishedAt: null,
				publishStartedAt: /* @__PURE__ */ new Date(),
				lastError: null,
				...failedCount ? { publishFailedCount: { decrement: failedCount } } : {}
			}
		})]);
		await enqueueSeoJob(jobId, "publish");
		return {
			ok: true,
			intent: "retry_failed_publish",
			retried: idsAll.length
		};
	}
	if (intent === "retry_failed_generate") {
		const maybe = safeParse$1(String(formData.get("items") || "[]"), []);
		let productIds = Array.isArray(maybe) ? maybe.map((x) => String(x?.productId || x || "").trim()).filter(Boolean) : [];
		if (!productIds.length) productIds = (await prisma.seoJobItem.findMany({
			where: {
				jobId,
				status: "failed"
			},
			select: { productId: true }
		})).map((f) => String(f.productId));
		if (!productIds.length) return {
			ok: false,
			error: "No failed items to retry"
		};
		const idsAll = Array.from(new Set(productIds.flatMap((p) => productIdVariants(p))));
		const failedCount = await prisma.seoJobItem.count({ where: {
			jobId,
			productId: { in: idsAll },
			status: "failed"
		} });
		await prisma.$transaction([prisma.seoJobItem.updateMany({
			where: {
				jobId,
				productId: { in: idsAll }
			},
			data: {
				status: "queued",
				error: null,
				startedAt: null,
				finishedAt: null
			}
		}), prisma.seoJob.update({
			where: { id: jobId },
			data: {
				status: "queued",
				phase: "generating",
				finishedAt: null,
				startedAt: /* @__PURE__ */ new Date(),
				lastError: null,
				...failedCount ? { failedCount: { decrement: failedCount } } : {}
			}
		})]);
		await enqueueSeoJob(jobId, "generate");
		return {
			ok: true,
			intent: "retry_failed_generate",
			retried: idsAll.length
		};
	}
	if (intent === "start_publish_all") {
		await prisma.seoJobItem.updateMany({
			where: { jobId },
			data: {
				publishStatus: "queued",
				publishError: null,
				publishedAt: null
			}
		});
		await prisma.seoJob.update({
			where: { id: jobId },
			data: {
				phase: "publishing",
				status: "queued",
				publishStartedAt: /* @__PURE__ */ new Date(),
				publishFinishedAt: null,
				publishOkCount: 0,
				publishFailedCount: 0,
				lastError: null
			}
		});
		await enqueueSeoJob(jobId, "publish");
		return { ok: true };
	}
	return {
		ok: false,
		error: "Unknown intent"
	};
}
/** ---------------- helpers ---------------- */
function normalizePhase(phase) {
	return String(phase || "").toLowerCase();
}
function normalizeStatus$1(status) {
	return String(status || "").toLowerCase();
}
function outputsLabel(job) {
	if (String(job?.jobType || "PRODUCT_SEO") === "ALT_TEXT_IMAGES") return "ALT text";
	const parts = [];
	const mt = Boolean(job?.metaTitle ?? true);
	const md = Boolean(job?.metaDescription ?? true);
	if (mt) parts.push("Title");
	if (md) parts.push("Description");
	return parts.length ? parts.join(" + ") : "—";
}
/**
* Badge Rules:
* - UI değişti ama save draft yapılmadı -> Edited
* - Save draft yapıldı (publish'ten sonra aktif draft varsa) -> Draft saved
* - Publish oldu (edit yoksa) -> Published
* - Publish olup sonra tekrar değişti -> Edited
*
* Not: Draft saved tespiti "Save draft'a basıldığı an" üzerinden yapılır (en stabil).
*/
function computeSingleBadge({ pid, fields, draftEdits, draftSavedSnapshot, publishedBaseline, publishStatus, dbPublishedAt }) {
	const ps = String(publishStatus || "").toLowerCase();
	const publishRunning = isPublishRunningStatus(ps);
	const publishFailed = ps === "failed";
	const publishedAtMs = toMs(dbPublishedAt);
	const isPublished = isPublishSuccessStatus(ps) || Boolean(publishedAtMs);
	const snap = draftSavedSnapshot?.[pid] || {};
	const snapSavedAtMs = toMs(snap?.draftSavedAt);
	const cur = draftEdits?.[pid] || {};
	const curTitle = String(cur?.seoTitle ?? "");
	const curDesc = String(cur?.seoDescription ?? "");
	const snapTitle = String(snap?.seoTitle ?? "");
	const snapDesc = String(snap?.seoDescription ?? "");
	const pubTitle = String(publishedBaseline?.seoTitle ?? "");
	const pubDesc = String(publishedBaseline?.seoDescription ?? "");
	const hasDraftSavedAfterPublish = Boolean(snapSavedAtMs) && Boolean(publishedAtMs) && snapSavedAtMs > publishedAtMs + 1500;
	const differsFromSnapshot = (fields.metaTitle ? curTitle !== snapTitle : false) || (fields.metaDescription ? curDesc !== snapDesc : false);
	const differsFromPublished = (fields.metaTitle ? curTitle !== pubTitle : false) || (fields.metaDescription ? curDesc !== pubDesc : false);
	if (publishRunning) return {
		tone: "info",
		label: "Publishing"
	};
	if (publishFailed) return {
		tone: "critical",
		label: "Failed"
	};
	if (isPublished && hasDraftSavedAfterPublish) {
		if (differsFromSnapshot) return {
			tone: "warning",
			label: "Edited"
		};
		return {
			tone: "info",
			label: "Draft saved"
		};
	}
	if (isPublished) {
		if (differsFromPublished) return {
			tone: "warning",
			label: "Edited"
		};
		return {
			tone: "success",
			label: "Published"
		};
	}
	if (differsFromSnapshot) return {
		tone: "warning",
		label: "Edited"
	};
	if (snapSavedAtMs) return {
		tone: "info",
		label: "Draft saved"
	};
	if (ps === "skipped") return {
		tone: "subdued",
		label: "Not selected"
	};
	return {
		tone: "attention",
		label: "Unpublished"
	};
}
function computeImageBadge({ draftAlt, currentAlt, publishStatus, dbPublishedAt }) {
	const ps = String(publishStatus || "").toLowerCase();
	const publishRunning = isPublishRunningStatus(ps);
	const publishFailed = ps === "failed";
	const publishedAtMs = toMs(dbPublishedAt);
	const isPublished = isPublishSuccessStatus(ps) || Boolean(publishedAtMs);
	const isEdited = String(draftAlt ?? "").trim() !== String(currentAlt ?? "").trim();
	if (publishRunning) return {
		tone: "info",
		label: "Publishing"
	};
	if (publishFailed) return {
		tone: "critical",
		label: "Failed"
	};
	if (isEdited) return {
		tone: "warning",
		label: "Edited"
	};
	if (isPublished) return {
		tone: "success",
		label: "Published"
	};
	if (ps === "skipped") return {
		tone: "subdued",
		label: "Not selected"
	};
	return {
		tone: "attention",
		label: "Unpublished"
	};
}
/** ---------------- component ---------------- */
var app_generation_history_$jobId_default = UNSAFE_withComponentProps(function GenerationDetails() {
	const { jobId } = useParams();
	const { job: jobFromLoader, liveSeoMap, settings } = useLoaderData();
	const poller = useFetcher();
	const actionFetcher = useFetcher();
	const location = useLocation();
	const navigate = useNavigate();
	const [draftEdits, setDraftEdits] = useState({});
	const [draftSavedSnapshot, setDraftSavedSnapshot] = useState({});
	const [publishedMap, setPublishedMap] = useState({});
	const [selected, setSelected] = useState({});
	const [showCompare, setShowCompare] = useState(true);
	const [showFailedOnly, setShowFailedOnly] = useState(false);
	const [applyOnlyChanged, setApplyOnlyChanged] = useState(true);
	const [toast, setToast] = useState(null);
	const genDoneToastRef = useRef(false);
	const pubDoneToastRef = useRef(false);
	useEffect(() => {
		const t = setInterval(() => {
			if (actionFetcher.state !== "idle") return;
			if (poller.state !== "idle") return;
			poller.load(`${location.pathname}${location.search || ""}`);
		}, 2500);
		return () => clearInterval(t);
	}, [
		poller,
		poller.state,
		location.pathname,
		location.search,
		actionFetcher.state
	]);
	const job = useMemo(() => {
		const d = poller.data;
		if (d && typeof d === "object" && d.job) return d.job;
		return jobFromLoader;
	}, [poller.data, jobFromLoader]);
	useEffect(() => {
		const d = actionFetcher.data;
		if (!d || typeof d !== "object") return;
		if (d.ok) {
			if (d.newJobId) {
				try {
					navigate(`/app/generation-history/${String(d.newJobId)}${backSearch}`);
				} catch {}
				return;
			}
			setToast({
				content: d.intent === "save_draft_selected" ? "Draft saved" : d.intent === "publish_selected" ? `Apply queued (${Number(d.queued || 0)})${Number(d.skipped || 0) ? `, skipped (${Number(d.skipped || 0)} no changes)` : ""}` : d.intent === "regenerate_selected" ? "Regenerate queued (new job)" : d.intent === "regenerate_failed" ? "Regenerate failed queued (new job)" : d.intent === "retry_failed_publish" ? `Retry queued (${Number(d.retried || 0)})` : d.intent === "retry_failed_generate" ? `Retry queued (${Number(d.retried || 0)})` : d.intent === "retry_job_publish" ? "Retry apply queued" : d.intent === "retry_job_generate" ? "Retry generate queued" : "Action queued",
				error: false
			});
			try {
				poller.load(`${location.pathname}${location.search || ""}`);
			} catch {}
			let ticks = 0;
			const t = setInterval(() => {
				ticks += 1;
				if (ticks > 6) {
					clearInterval(t);
					return;
				}
				if (poller.state !== "idle") return;
				poller.load(`${location.pathname}${location.search || ""}`);
			}, 1500);
			return () => clearInterval(t);
		}
		if (d.error) setToast({
			content: String(d.error),
			error: true
		});
	}, [actionFetcher.data]);
	useEffect(() => {
		const d = poller.data;
		if (d && typeof d === "object" && d.liveSeoMap) setPublishedMap(d.liveSeoMap || {});
	}, [poller.data]);
	const loading = !job;
	const isImageJob = useMemo(() => String(job?.jobType || "PRODUCT_SEO") === "ALT_TEXT_IMAGES", [job?.jobType]);
	const itemKey = useCallback((it) => {
		if (!it) return "";
		return isImageJob ? String(it.id || "") : String(it.productId || "");
	}, [isImageJob]);
	const fields = useMemo(() => {
		const metaTitle = job ? Boolean(job?.metaTitle ?? true) : true;
		const metaDescription = job ? Boolean(job?.metaDescription ?? true) : true;
		if (!metaTitle && !metaDescription) return {
			metaTitle: true,
			metaDescription: true
		};
		return {
			metaTitle,
			metaDescription
		};
	}, [job]);
	const items = useMemo(() => Array.isArray(job?.items) ? job.items : [], [job?.items]);
	const hydratedRef = useRef(false);
	useEffect(() => {
		hydratedRef.current = false;
	}, [jobId]);
	useEffect(() => {
		if (!jobId) return;
		if (hydratedRef.current) return;
		hydratedRef.current = true;
		setDraftEdits({});
		setDraftSavedSnapshot({});
		setPublishedMap(liveSeoMap || {});
		setSelected((prev) => {
			if (prev && Object.keys(prev).length > 0) return prev;
			const sel = {};
			const its = Array.isArray(job?.items) ? job.items : [];
			for (const it of its) {
				const k = itemKey(it);
				if (!k) continue;
				sel[k] = String(it?.publishStatus || "").toLowerCase() === "skipped" ? false : true;
			}
			return sel;
		});
	}, [
		jobId,
		job?.items,
		liveSeoMap
	]);
	useEffect(() => {
		if (!items.length) return;
		setSelected((prev) => {
			const next = { ...prev || {} };
			let changed = false;
			for (const it of items) {
				const k = itemKey(it);
				if (!k) continue;
				if (next[k] === void 0) {
					next[k] = String(it?.publishStatus || "").toLowerCase() === "skipped" ? false : true;
					changed = true;
				}
			}
			return changed ? next : prev;
		});
	}, [items]);
	const selectedIds = useMemo(() => {
		return items.map((it) => itemKey(it)).filter((k) => k && Boolean(selected[k]));
	}, [
		items,
		selected,
		itemKey
	]);
	const failedPublishSelectedCount = useMemo(() => {
		return items.filter((it) => {
			const k = itemKey(it);
			return k && Boolean(selected[k]) && String(it?.publishStatus || "").toLowerCase() === "failed";
		}).length;
	}, [
		items,
		selected,
		itemKey
	]);
	const failedGenerateSelectedCount = useMemo(() => {
		return items.filter((it) => {
			const k = itemKey(it);
			return k && Boolean(selected[k]) && String(it?.status || "").toLowerCase() === "failed";
		}).length;
	}, [
		items,
		selected,
		itemKey
	]);
	const allSelected = selectedIds.length === items.length && items.length > 0;
	const toggleAll = useCallback(() => {
		const next = {};
		const newVal = !allSelected;
		for (const it of items) {
			const k = itemKey(it);
			if (!k) continue;
			next[k] = newVal;
		}
		setSelected(next);
	}, [
		allSelected,
		items,
		itemKey
	]);
	const toggleOne = useCallback((k) => {
		setSelected((prev) => ({
			...prev || {},
			[String(k)]: !prev?.[String(k)]
		}));
	}, []);
	const setDraftField = useCallback((k, field, value) => {
		setDraftEdits((prev) => {
			const p = String(k);
			const cur = prev?.[p] || {
				seoTitle: "",
				seoDescription: "",
				draftSavedAt: null
			};
			return {
				...prev || {},
				[p]: {
					...cur,
					[field]: value
				}
			};
		});
	}, []);
	useEffect(() => {
		if (!jobId) return;
		if (!items.length) return;
		setDraftEdits((prev) => {
			const next = { ...prev || {} };
			for (const it of items) {
				const pid = itemKey(it);
				if (!pid) continue;
				const existing = next[pid] || {};
				const nextTitle = (existing.seoTitle ?? "") !== "" ? existing.seoTitle : String(it.seoTitle ?? "");
				const nextDesc = (existing.seoDescription ?? "") !== "" ? existing.seoDescription : String(it.seoDescription ?? "");
				next[pid] = {
					seoTitle: nextTitle || "",
					seoDescription: nextDesc || "",
					draftSavedAt: existing.draftSavedAt || null
				};
			}
			return next;
		});
		setDraftSavedSnapshot((prev) => {
			const next = { ...prev || {} };
			for (const it of items) {
				const pid = itemKey(it);
				if (!pid) continue;
				if (!next[pid]) next[pid] = {
					seoTitle: String(it.seoTitle ?? ""),
					seoDescription: String(it.seoDescription ?? ""),
					draftSavedAt: null
				};
			}
			return next;
		});
	}, [
		jobId,
		items,
		itemKey
	]);
	const saveDraftSelected = useCallback(() => {
		if (!jobId) return;
		if (!selectedIds.length) return;
		const now = nowIso();
		const payload = selectedIds.map((k) => {
			const edit = draftEdits?.[k] || {};
			if (isImageJob) return {
				id: String(k),
				seoTitle: String(edit.seoTitle ?? "")
			};
			return {
				productId: String(k),
				seoTitle: fields.metaTitle ? String(edit.seoTitle ?? "") : null,
				seoDescription: fields.metaDescription ? String(edit.seoDescription ?? "") : null
			};
		});
		const fd = new FormData();
		fd.set("intent", "save_draft_selected");
		fd.set("items", JSON.stringify(payload));
		actionFetcher.submit(fd, { method: "post" });
		setDraftSavedSnapshot((prev) => {
			const next = { ...prev || {} };
			for (const row of payload) {
				const key = isImageJob ? String(row.id || "") : String(row.productId || "");
				if (!key) continue;
				const prevItem = next[key] || {};
				next[key] = {
					...prevItem,
					seoTitle: row.seoTitle == null ? String(prevItem.seoTitle ?? "") : String(row.seoTitle),
					seoDescription: isImageJob ? String(prevItem.seoDescription ?? "") : row.seoDescription == null ? String(prevItem.seoDescription ?? "") : String(row.seoDescription),
					draftSavedAt: now
				};
			}
			return next;
		});
		setDraftEdits((prev) => {
			const next = { ...prev || {} };
			for (const k of selectedIds) next[k] = {
				...next[k] || {
					seoTitle: "",
					seoDescription: "",
					draftSavedAt: null
				},
				draftSavedAt: now
			};
			return next;
		});
	}, [
		jobId,
		selectedIds,
		draftEdits,
		fields,
		actionFetcher,
		isImageJob
	]);
	const publishSelected = useCallback(() => {
		if (!jobId) return;
		if (!selectedIds.length) return;
		const payload = selectedIds.map((k) => {
			const it = items.find((x) => itemKey(x) === String(k));
			const baseTitle = String(it?.seoTitle ?? "");
			const baseDesc = String(it?.seoDescription ?? "");
			const edit = draftEdits?.[k] || {};
			if (isImageJob) return {
				id: String(k),
				seoTitle: String(edit.seoTitle ?? baseTitle)
			};
			return {
				productId: String(k),
				seoTitle: fields.metaTitle ? String(edit.seoTitle ?? baseTitle) : null,
				seoDescription: fields.metaDescription ? String(edit.seoDescription ?? baseDesc) : null
			};
		});
		const fd = new FormData();
		fd.set("intent", "publish_selected");
		fd.set("items", JSON.stringify(payload));
		fd.set("onlyChanged", applyOnlyChanged ? "true" : "false");
		actionFetcher.submit(fd, { method: "post" });
	}, [
		jobId,
		selectedIds,
		draftEdits,
		fields,
		actionFetcher,
		items,
		applyOnlyChanged,
		isImageJob,
		itemKey
	]);
	const regenerateSelected = useCallback((onlyFailed = false) => {
		if (!jobId) return;
		let targetIds = [];
		if (onlyFailed) targetIds = items.filter((it) => String(it?.status || "").toLowerCase() === "failed").filter((it) => {
			const pid = String(it?.productId || "");
			return pid && (selected[pid] || !selectedIds.length);
		}).map((it) => String(it.productId));
		else targetIds = [...selectedIds];
		const payload = targetIds.map((pid) => ({ productId: String(pid) }));
		const fd = new FormData();
		fd.set("intent", onlyFailed ? "regenerate_failed" : "regenerate_selected");
		fd.set("items", JSON.stringify(payload));
		actionFetcher.submit(fd, { method: "post" });
	}, [
		jobId,
		selectedIds,
		selected,
		items,
		actionFetcher
	]);
	const retryFailedPublish = useCallback((onlySelected = true) => {
		if (!jobId) return;
		const payload = items.filter((it) => {
			if (String(it?.publishStatus || "").toLowerCase() !== "failed") return false;
			if (!onlySelected) return true;
			const pid = String(it?.productId || "");
			return pid && Boolean(selected[pid]);
		}).map((it) => ({ productId: String(it.productId) }));
		const fd = new FormData();
		fd.set("intent", "retry_failed_publish");
		fd.set("items", JSON.stringify(payload));
		actionFetcher.submit(fd, { method: "post" });
	}, [
		jobId,
		items,
		selected,
		actionFetcher
	]);
	const retryFailedGenerate = useCallback((onlySelected = true) => {
		if (!jobId) return;
		const payload = items.filter((it) => {
			if (String(it?.status || "").toLowerCase() !== "failed") return false;
			if (!onlySelected) return true;
			const pid = String(it?.productId || "");
			return pid && Boolean(selected[pid]);
		}).map((it) => ({ productId: String(it.productId) }));
		const fd = new FormData();
		fd.set("intent", "retry_failed_generate");
		fd.set("items", JSON.stringify(payload));
		actionFetcher.submit(fd, { method: "post" });
	}, [
		jobId,
		items,
		selected,
		actionFetcher
	]);
	const backSearch = useMemo(() => buildEmbeddedSearch(location.search), [location.search]);
	const phase = normalizePhase(job?.phase);
	const status = normalizeStatus$1(job?.status);
	const isStuck = status === "stuck";
	const isGeneratingPhase = phase === "generating";
	const isPublishingPhase = phase === "publishing";
	const retryWholeJob = useCallback((which) => {
		if (!jobId) return;
		const fd = new FormData();
		fd.set("intent", which === "publish" ? "retry_job_publish" : "retry_job_generate");
		actionFetcher.submit(fd, { method: "post" });
	}, [jobId, actionFetcher]);
	const publishTotal = useMemo(() => {
		if (!items.length) return 0;
		return items.filter((it) => String(it?.publishStatus || "").toLowerCase() !== "skipped").length || items.length;
	}, [items]);
	const genOk = Number(job?.okCount ?? 0);
	const genFailed = Number(job?.failedCount ?? 0);
	const total = Number(job?.total ?? items.length ?? 0);
	const genProcessed = genOk + genFailed;
	const genDone = total > 0 && genProcessed >= total && (phase === "generating" || phase === "generated" || phase === "publishing" || phase === "published");
	const pubOk = Number(job?.publishOkCount ?? 0);
	const pubFailed = Number(job?.publishFailedCount ?? 0);
	const pubProcessed = pubOk + pubFailed;
	const pubDone = publishTotal > 0 && pubProcessed >= publishTotal && (phase === "publishing" || phase === "published");
	useEffect(() => {
		if (genDone && !genDoneToastRef.current) {
			genDoneToastRef.current = true;
			setToast({
				content: genFailed > 0 ? `Generation finished: ${genOk}/${total} succeeded, ${genFailed} failed` : `Generation finished: ${genOk}/${total} succeeded`,
				error: genFailed > 0
			});
		}
	}, [
		genDone,
		genOk,
		genFailed,
		total
	]);
	useEffect(() => {
		if (pubDone && !pubDoneToastRef.current) {
			pubDoneToastRef.current = true;
			setToast({
				content: pubFailed > 0 ? `Apply finished: ${pubOk}/${publishTotal} succeeded, ${pubFailed} failed` : `Apply finished: ${pubOk}/${publishTotal} succeeded`,
				error: pubFailed > 0
			});
		}
	}, [
		pubDone,
		pubOk,
		pubFailed,
		publishTotal
	]);
	const visibleItems = useMemo(() => {
		if (!showFailedOnly) return items;
		if (phase === "publishing" || phase === "published") return items.filter((it) => String(it?.publishStatus || "").toLowerCase() === "failed");
		return items.filter((it) => String(it?.status || "").toLowerCase() === "failed");
	}, [
		items,
		showFailedOnly,
		phase
	]);
	const progressText = useMemo(() => {
		if (!job) return "";
		const total = Number(job?.total ?? items.length ?? 0);
		if (phase === "publishing" || phase === "published") {
			const processed = Number(job?.publishOkCount ?? 0) + Number(job?.publishFailedCount ?? 0);
			if (phase === "publishing") return `${processed}/${publishTotal} Published`;
			return `${publishTotal}/${publishTotal} Published`;
		}
		const processed = Number(job?.okCount ?? 0) + Number(job?.failedCount ?? 0);
		if (phase === "generating") return `${processed}/${total} Generated`;
		return `${total}/${total} Generated`;
	}, [
		job,
		items.length,
		phase,
		publishTotal
	]);
	const topStatusBar = useMemo(() => {
		if (!job) return null;
		if (phase === "publishing") return /* @__PURE__ */ jsx(Banner, {
			tone: "info",
			title: "Publishing in progress",
			children: /* @__PURE__ */ jsx(Text, {
				as: "p",
				variant: "bodyMd",
				children: progressText
			})
		});
		if (status === "failed") return /* @__PURE__ */ jsx(Banner, {
			tone: "critical",
			title: "Job failed",
			children: /* @__PURE__ */ jsx(Text, {
				as: "p",
				variant: "bodyMd",
				children: "Please check logs and try again."
			})
		});
		return null;
	}, [
		job,
		phase,
		status,
		progressText
	]);
	if (loading) return /* @__PURE__ */ jsx(Frame, { children: /* @__PURE__ */ jsx(Page, {
		title: "Generation Details",
		fullWidth: true,
		children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(Box, {
			padding: "400",
			children: /* @__PURE__ */ jsxs(InlineStack, {
				gap: "200",
				blockAlign: "center",
				children: [/* @__PURE__ */ jsx(Spinner$1, { size: "small" }), /* @__PURE__ */ jsx(Text, {
					as: "span",
					variant: "bodyMd",
					children: "Loading…"
				})]
			})
		}) }) }) })
	}) });
	return /* @__PURE__ */ jsxs(Frame, { children: [toast ? /* @__PURE__ */ jsx(Toast, {
		content: toast.content,
		error: toast.error,
		onDismiss: () => setToast(null)
	}) : null, /* @__PURE__ */ jsx(Page, {
		title: "Generation Details",
		subtitle: `Job: #${jobId || ""}`,
		backAction: {
			content: "Back",
			onAction: () => navigate(`/app/generation-history${backSearch}`)
		},
		fullWidth: true,
		children: /* @__PURE__ */ jsxs(BlockStack, {
			gap: "400",
			children: [
				topStatusBar,
				isStuck ? /* @__PURE__ */ jsxs(Banner, {
					tone: "critical",
					title: "Job seems stuck",
					action: isPublishingPhase ? {
						content: "Retry apply",
						onAction: () => retryWholeJob("publish")
					} : isGeneratingPhase ? {
						content: "Retry generate",
						onAction: () => retryWholeJob("generate")
					} : {
						content: "Retry",
						onAction: () => retryWholeJob("generate")
					},
					secondaryAction: {
						content: "Export debug report",
						url: `/app/debug-report/${encodeURIComponent(String(jobId || "").trim())}`,
						external: true
					},
					children: [/* @__PURE__ */ jsx(Text, {
						as: "p",
						variant: "bodyMd",
						children: "We couldn't detect progress for a while. Retrying will resume from where it stopped."
					}), job?.lastError ? /* @__PURE__ */ jsx(Text, {
						as: "p",
						tone: "subdued",
						variant: "bodySm",
						children: String(job.lastError).slice(0, 220)
					}) : null]
				}) : null,
				/* @__PURE__ */ jsx(Banner, {
					tone: phase === "publishing" || phase === "generating" ? "info" : genFailed > 0 || pubFailed > 0 ? "warning" : "success",
					title: "Summary",
					children: /* @__PURE__ */ jsxs(BlockStack, {
						gap: "200",
						children: [
							/* @__PURE__ */ jsx(Text, {
								as: "p",
								variant: "bodyMd",
								children: `Generation: ${genOk}/${total} succeeded, ${genFailed} failed`
							}),
							phase === "publishing" || phase === "published" ? /* @__PURE__ */ jsx(Text, {
								as: "p",
								variant: "bodyMd",
								children: `Apply: ${pubOk}/${publishTotal} succeeded, ${pubFailed} failed`
							}) : null,
							/* @__PURE__ */ jsxs(InlineStack, {
								gap: "200",
								wrap: true,
								children: [
									/* @__PURE__ */ jsx(Button, {
										variant: "secondary",
										onClick: () => setShowFailedOnly((v) => !v),
										disabled: items.length === 0,
										children: showFailedOnly ? "Show all items" : "Show failed only"
									}),
									genFailed > 0 ? /* @__PURE__ */ jsx(Button, {
										variant: "secondary",
										onClick: () => retryFailedGenerate(false),
										disabled: actionFetcher.state !== "idle",
										children: `Retry all failed generate (${genFailed})`
									}) : null,
									pubFailed > 0 ? /* @__PURE__ */ jsx(Button, {
										variant: "secondary",
										onClick: () => retryFailedPublish(false),
										disabled: actionFetcher.state !== "idle",
										children: `Retry all failed apply (${pubFailed})`
									}) : null
								]
							})
						]
					})
				}),
				/* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, {
					gap: "300",
					children: [
						/* @__PURE__ */ jsxs(InlineStack, {
							align: "space-between",
							blockAlign: "center",
							children: [/* @__PURE__ */ jsxs(InlineStack, {
								gap: "200",
								blockAlign: "center",
								children: [/* @__PURE__ */ jsx(Text, {
									as: "h2",
									variant: "headingMd",
									children: "Generated Results"
								}), /* @__PURE__ */ jsx(Badge, {
									tone: "info",
									children: `Outputs: ${outputsLabel(job)}`
								})]
							}), /* @__PURE__ */ jsxs(InlineStack, {
								gap: "200",
								children: [
									/* @__PURE__ */ jsx(Button, {
										variant: "secondary",
										onClick: toggleAll,
										disabled: items.length === 0,
										children: allSelected ? "Unselect all" : "Select all"
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "secondary",
										onClick: () => setShowCompare((v) => !v),
										disabled: items.length === 0 || isImageJob,
										children: showCompare ? "Hide compare" : "Show compare"
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "secondary",
										onClick: saveDraftSelected,
										disabled: selectedIds.length === 0 || actionFetcher.state !== "idle",
										children: "Save draft"
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "secondary",
										onClick: () => regenerateSelected(false),
										disabled: isImageJob || selectedIds.length === 0 || actionFetcher.state !== "idle",
										children: "Regenerate selected (new job)"
									}),
									genFailed > 0 ? /* @__PURE__ */ jsx(Button, {
										variant: "secondary",
										onClick: () => regenerateSelected(true),
										disabled: isImageJob || actionFetcher.state !== "idle",
										children: "Regenerate failed (new job)"
									}) : null,
									failedGenerateSelectedCount > 0 ? /* @__PURE__ */ jsxs(Button, {
										variant: "secondary",
										onClick: () => retryFailedGenerate(true),
										disabled: isImageJob || actionFetcher.state !== "idle",
										children: [
											"Retry failed generate (",
											failedGenerateSelectedCount,
											")"
										]
									}) : null,
									failedPublishSelectedCount > 0 ? /* @__PURE__ */ jsxs(Button, {
										variant: "secondary",
										onClick: () => retryFailedPublish(true),
										disabled: isImageJob || actionFetcher.state !== "idle",
										children: [
											"Retry failed apply (",
											failedPublishSelectedCount,
											")"
										]
									}) : null,
									/* @__PURE__ */ jsx(Box, {
										paddingInlineStart: "200",
										children: /* @__PURE__ */ jsx(Checkbox$1, {
											label: "Only changed",
											checked: applyOnlyChanged,
											onChange: (v) => setApplyOnlyChanged(Boolean(v)),
											disabled: actionFetcher.state !== "idle"
										})
									}),
									/* @__PURE__ */ jsx(Button, {
										onClick: publishSelected,
										disabled: selectedIds.length === 0 || actionFetcher.state !== "idle",
										loading: actionFetcher.state !== "idle",
										children: "Apply selected"
									}),
									/* @__PURE__ */ jsx(Button, {
										variant: "secondary",
										url: `/app/debug-report/${encodeURIComponent(String(jobId || "").trim())}`,
										external: true,
										children: "Export debug report"
									})
								]
							})]
						}),
						/* @__PURE__ */ jsx(Divider, {}),
						items.length === 0 ? /* @__PURE__ */ jsx(Text, {
							as: "p",
							tone: "subdued",
							children: "No results found for this job."
						}) : /* @__PURE__ */ jsxs(BlockStack, {
							gap: "400",
							children: [showFailedOnly && visibleItems.length === 0 ? /* @__PURE__ */ jsx(Text, {
								as: "p",
								tone: "subdued",
								children: "No failed items."
							}) : null, visibleItems.map((it) => {
								const k = itemKey(it);
								if (!k) return null;
								const edit = draftEdits?.[k] || {
									seoTitle: String(it.seoTitle ?? ""),
									seoDescription: String(it.seoDescription ?? ""),
									draftSavedAt: null
								};
								if (isImageJob) {
									const badge = computeImageBadge({
										draftAlt: edit.seoTitle,
										currentAlt: it.seoDescription,
										publishStatus: it.publishStatus,
										dbPublishedAt: it.publishedAt
									});
									return /* @__PURE__ */ jsx(Card, {
										sectioned: true,
										children: /* @__PURE__ */ jsxs(BlockStack, {
											gap: "200",
											children: [
												/* @__PURE__ */ jsxs(InlineStack, {
													align: "space-between",
													children: [/* @__PURE__ */ jsxs(InlineStack, {
														gap: "200",
														blockAlign: "center",
														children: [
															/* @__PURE__ */ jsx(Checkbox$1, {
																label: "",
																checked: Boolean(selected[k]),
																onChange: () => toggleOne(k)
															}),
															/* @__PURE__ */ jsx(Text, {
																as: "p",
																fontWeight: "semibold",
																children: it.productTitle || "Image"
															}),
															/* @__PURE__ */ jsx(Badge, {
																tone: "info",
																children: `Media: ${String(it.mediaId || it.targetId || "").slice(-8)}`
															})
														]
													}), /* @__PURE__ */ jsx(InlineStack, {
														gap: "200",
														blockAlign: "center",
														children: /* @__PURE__ */ jsx(Badge, {
															tone: badge.tone,
															children: badge.label
														})
													})]
												}),
												it.imageUrl ? /* @__PURE__ */ jsx(Box, {
													padding: "200",
													background: "bg-surface-secondary",
													borderRadius: "200",
													children: /* @__PURE__ */ jsx("img", {
														src: it.imageUrl,
														alt: String(edit.seoTitle || it.seoDescription || it.productTitle || "image"),
														style: {
															maxWidth: 220,
															height: "auto",
															borderRadius: 8
														}
													})
												}) : null,
												/* @__PURE__ */ jsx(TextField, {
													label: "ALT text",
													value: String(edit.seoTitle ?? ""),
													onChange: (v) => setDraftField(k, "seoTitle", v),
													autoComplete: "off",
													helpText: it.seoDescription ? `Current ALT: ${String(it.seoDescription)}` : "Current ALT is empty"
												}),
												/* @__PURE__ */ jsx(InlineStack, {
													align: "space-between",
													blockAlign: "center",
													children: /* @__PURE__ */ jsx(Text, {
														as: "p",
														variant: "bodySm",
														tone: "subdued",
														children: `Product: ${it.productTitle || ""}`
													})
												})
											]
										})
									}, k);
								}
								const pid = String(it.productId || "");
								const gid = toProductGid(pid);
								const live = publishedMap?.[gid] || liveSeoMap?.[gid] || {
									seoTitle: "",
									seoDescription: ""
								};
								const liveTitle = String(live?.seoTitle ?? "");
								const liveDesc = String(live?.seoDescription ?? "");
								const draftTitle = String(edit.seoTitle ?? "");
								const draftDesc = String(edit.seoDescription ?? "");
								const willChangeTitle = fields.metaTitle ? draftTitle !== liveTitle : false;
								const willChangeDesc = fields.metaDescription ? draftDesc !== liveDesc : false;
								const q = computeQuality({
									title: draftTitle,
									desc: draftDesc,
									settings
								});
								const qTone = q.score >= 80 ? "success" : q.score >= 60 ? "warning" : "critical";
								const badge = computeSingleBadge({
									pid,
									publishStatus: it.publishStatus,
									dbPublishedAt: it.publishedAt,
									draftEdits,
									draftSavedSnapshot,
									publishedBaseline: live,
									fields
								});
								return /* @__PURE__ */ jsx(Card, {
									sectioned: true,
									children: /* @__PURE__ */ jsxs(BlockStack, {
										gap: "200",
										children: [
											/* @__PURE__ */ jsxs(InlineStack, {
												align: "space-between",
												children: [/* @__PURE__ */ jsxs(InlineStack, {
													gap: "200",
													blockAlign: "center",
													children: [
														/* @__PURE__ */ jsx(Checkbox$1, {
															label: "",
															checked: Boolean(selected[pid]),
															onChange: () => toggleOne(pid)
														}),
														/* @__PURE__ */ jsx(Text, {
															as: "p",
															fontWeight: "semibold",
															children: it.productTitle || `Product #${pid}`
														}),
														/* @__PURE__ */ jsx(Badge, {
															tone: "info",
															children: `ID: ${pid}`
														})
													]
												}), /* @__PURE__ */ jsx(InlineStack, {
													gap: "200",
													blockAlign: "center",
													children: /* @__PURE__ */ jsx(Badge, {
														tone: badge.tone,
														children: badge.label
													})
												})]
											}),
											Number(it.genAttempts || 0) > 0 || Number(it.genRetryWaitMs || 0) > 0 || Number(it.publishAttempts || 0) > 0 || Number(it.publishRetryWaitMs || 0) > 0 ? /* @__PURE__ */ jsx(Text, {
												as: "p",
												tone: "subdued",
												variant: "bodySm",
												children: `Gen: ${Number(it.genAttempts || 0)} attempt(s), ${Number(it.genRetryWaitMs || 0)}ms wait • Publish: ${Number(it.publishAttempts || 0)} attempt(s), ${Number(it.publishRetryWaitMs || 0)}ms wait`
											}) : null,
											applyOnlyChanged && Boolean(selected[pid]) && !(willChangeTitle || willChangeDesc) ? /* @__PURE__ */ jsx(Text, {
												as: "p",
												tone: "subdued",
												variant: "bodySm",
												children: "No changes — this item will be skipped when applying."
											}) : null,
											/* @__PURE__ */ jsxs(BlockStack, {
												gap: "300",
												children: [
													fields.metaTitle || fields.metaDescription ? /* @__PURE__ */ jsxs(InlineStack, {
														align: "space-between",
														blockAlign: "center",
														children: [/* @__PURE__ */ jsx(Text, {
															as: "h3",
															variant: "headingSm",
															children: showCompare ? "Compare & Edit" : "Generated Content"
														}), showCompare ? /* @__PURE__ */ jsxs(InlineStack, {
															gap: "200",
															blockAlign: "center",
															children: [willChangeTitle || willChangeDesc ? /* @__PURE__ */ jsx(Badge, {
																tone: "warning",
																children: "Changes pending"
															}) : /* @__PURE__ */ jsx(Badge, {
																tone: "success",
																children: "No changes"
															}), /* @__PURE__ */ jsx(Button, {
																size: "slim",
																variant: "secondary",
																onClick: () => {
																	setDraftField(pid, "seoTitle", liveTitle);
																	setDraftField(pid, "seoDescription", liveDesc);
																},
																disabled: !liveTitle && !liveDesc,
																children: "Reset to current"
															})]
														}) : null]
													}) : null,
													showCompare ? /* @__PURE__ */ jsxs(Layout, { children: [/* @__PURE__ */ jsx(Layout.Section, {
														oneHalf: true,
														children: /* @__PURE__ */ jsxs(BlockStack, {
															gap: "200",
															children: [
																/* @__PURE__ */ jsx(Text, {
																	as: "p",
																	variant: "bodySm",
																	tone: "subdued",
																	children: "Current on Shopify"
																}),
																fields.metaTitle ? /* @__PURE__ */ jsx(TextField, {
																	label: "SEO Title (current)",
																	value: liveTitle,
																	disabled: true,
																	autoComplete: "off"
																}) : null,
																fields.metaDescription ? /* @__PURE__ */ jsx(TextField, {
																	label: "SEO Description (current)",
																	value: liveDesc,
																	disabled: true,
																	autoComplete: "off",
																	multiline: 4
																}) : null
															]
														})
													}), /* @__PURE__ */ jsx(Layout.Section, {
														oneHalf: true,
														children: /* @__PURE__ */ jsxs(BlockStack, {
															gap: "200",
															children: [
																/* @__PURE__ */ jsx(Text, {
																	as: "p",
																	variant: "bodySm",
																	tone: "subdued",
																	children: "New draft (will be applied)"
																}),
																fields.metaTitle ? /* @__PURE__ */ jsx(TextField, {
																	label: "SEO Title (new)",
																	value: draftTitle,
																	onChange: (val) => setDraftField(pid, "seoTitle", val),
																	autoComplete: "off",
																	helpText: `${draftTitle.length}/${q.maxTitle} • ` + (willChangeTitle ? "Will update after publish" : "Same as current"),
																	error: draftTitle.length > q.maxTitle
																}) : null,
																fields.metaDescription ? /* @__PURE__ */ jsx(TextField, {
																	label: "SEO Description (new)",
																	value: draftDesc,
																	onChange: (val) => setDraftField(pid, "seoDescription", val),
																	autoComplete: "off",
																	multiline: 4,
																	helpText: `${draftDesc.length}/${q.maxDesc} • ` + (willChangeDesc ? "Will update after publish" : "Same as current"),
																	error: draftDesc.length > q.maxDesc
																}) : null
															]
														})
													})] }) : /* @__PURE__ */ jsxs(Fragment, { children: [fields.metaTitle ? /* @__PURE__ */ jsx(TextField, {
														label: "Generated SEO Title",
														value: String(edit.seoTitle ?? ""),
														onChange: (val) => setDraftField(pid, "seoTitle", val),
														autoComplete: "off",
														helpText: `${String(edit.seoTitle ?? "").length}/${q.maxTitle}`,
														error: String(edit.seoTitle ?? "").length > q.maxTitle
													}) : null, fields.metaDescription ? /* @__PURE__ */ jsx(TextField, {
														label: "Generated SEO Description",
														value: String(edit.seoDescription ?? ""),
														onChange: (val) => setDraftField(pid, "seoDescription", val),
														autoComplete: "off",
														multiline: 4,
														helpText: `${String(edit.seoDescription ?? "").length}/${q.maxDesc}`,
														error: String(edit.seoDescription ?? "").length > q.maxDesc
													}) : null] }),
													!fields.metaTitle && !fields.metaDescription ? /* @__PURE__ */ jsx(Text, {
														as: "p",
														tone: "subdued",
														children: "No output was selected for this job."
													}) : null,
													fields.metaTitle || fields.metaDescription ? /* @__PURE__ */ jsx(Box, {
														padding: "400",
														background: "bg-surface-secondary",
														borderColor: "border",
														borderWidth: "025",
														borderRadius: "200",
														children: /* @__PURE__ */ jsxs(BlockStack, {
															gap: "300",
															children: [
																/* @__PURE__ */ jsxs(InlineStack, {
																	align: "space-between",
																	blockAlign: "center",
																	children: [/* @__PURE__ */ jsx(Text, {
																		as: "p",
																		variant: "bodySm",
																		fontWeight: "semibold",
																		children: "Preview & Quality"
																	}), /* @__PURE__ */ jsx(Badge, {
																		tone: qTone,
																		children: `Quality ${q.score}/100`
																	})]
																}),
																/* @__PURE__ */ jsx(ProgressBar, { progress: q.score }),
																/* @__PURE__ */ jsxs(BlockStack, {
																	gap: "100",
																	children: [
																		/* @__PURE__ */ jsx(Text, {
																			as: "p",
																			variant: "bodySm",
																			fontWeight: "semibold",
																			children: "Google snippet (approx.)"
																		}),
																		/* @__PURE__ */ jsx(Text, {
																			as: "p",
																			variant: "headingSm",
																			children: clampText(draftTitle || it.productTitle || "", q.maxTitle)
																		}),
																		/* @__PURE__ */ jsx(Text, {
																			as: "p",
																			variant: "bodySm",
																			tone: "subdued",
																			children: `https://${String(settings?.brandName || "your-store").toLowerCase().replace(/\s+/g, "")}.com/products/...`
																		}),
																		/* @__PURE__ */ jsx(Text, {
																			as: "p",
																			variant: "bodySm",
																			tone: "subdued",
																			children: clampText(draftDesc || "", q.maxDesc)
																		})
																	]
																}),
																/* @__PURE__ */ jsx(Divider, {}),
																/* @__PURE__ */ jsxs(BlockStack, {
																	gap: "100",
																	children: [/* @__PURE__ */ jsx(Text, {
																		as: "p",
																		variant: "bodySm",
																		fontWeight: "semibold",
																		children: "Checklist"
																	}), q.checks.map((c) => /* @__PURE__ */ jsxs(InlineStack, {
																		align: "space-between",
																		blockAlign: "center",
																		children: [/* @__PURE__ */ jsx(Text, {
																			as: "span",
																			variant: "bodySm",
																			children: c.label
																		}), /* @__PURE__ */ jsx(Badge, {
																			tone: c.ok ? "success" : "critical",
																			children: c.ok ? "OK" : "Fix"
																		})]
																	}, c.key))]
																})
															]
														})
													}) : null,
													it.error || it.publishError ? /* @__PURE__ */ jsx(Banner, {
														tone: "critical",
														title: "Error",
														children: /* @__PURE__ */ jsx("p", { children: String(it.publishError || it.error || "") })
													}) : null
												]
											})
										]
									})
								}, pid);
							})]
						})
					]
				}) }),
				/* @__PURE__ */ jsx(InlineStack, {
					align: "end",
					children: /* @__PURE__ */ jsx(Button, {
						variant: "secondary",
						onClick: () => navigate(`/app/generation-history${backSearch}`),
						children: "Back to Generation History"
					})
				})
			]
		})
	})] });
});
/** ---------------- route ErrorBoundary ---------------- */
var ErrorBoundary$3 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const err = useRouteError();
	console.error("GenerationDetails ErrorBoundary:", err);
	let title = "Generation Details crashed";
	let message = "Unknown error";
	if (isRouteErrorResponse(err)) {
		title = `Error ${err.status}`;
		message = err.data || err.statusText;
	} else if (err instanceof Error) message = err.message;
	else message = String(err);
	return /* @__PURE__ */ jsx(Page, {
		title: "Generation Details",
		fullWidth: true,
		children: /* @__PURE__ */ jsx(Banner, {
			tone: "critical",
			title,
			children: /* @__PURE__ */ jsx(Text, {
				as: "p",
				variant: "bodyMd",
				children: message
			})
		})
	});
});
//#endregion
//#region app/routes/app.additional.jsx
var app_additional_exports = /* @__PURE__ */ __exportAll({ default: () => app_additional_default });
var app_additional_default = UNSAFE_withComponentProps(function AdditionalPage() {
	return /* @__PURE__ */ jsx(Page, {
		title: "Additional page",
		children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, {
			gap: "300",
			children: [/* @__PURE__ */ jsx(Text, {
				as: "p",
				variant: "bodyMd",
				children: "This is an example extra page, rendered with Shopify Polaris components."
			}), /* @__PURE__ */ jsxs(Text, {
				as: "p",
				variant: "bodyMd",
				children: [
					"Learn more about embedded apps and navigation in",
					" ",
					/* @__PURE__ */ jsx(Link$1, {
						url: "https://shopify.dev/docs/apps/tools/app-bridge",
						external: true,
						children: "Shopify App Bridge docs"
					}),
					"."
				]
			})]
		}) }) }) })
	});
});
//#endregion
//#region app/routes/app.onboarding.jsx
var app_onboarding_exports = /* @__PURE__ */ __exportAll({
	default: () => app_onboarding_default,
	headers: () => headers$4,
	loader: () => loader$7
});
var SETTINGS_NAMESPACE$2 = "ai_seo_assistant";
var SETTINGS_KEY$2 = "settings";
async function getSettingsFromMetafield$2(admin) {
	const raw = (await (await admin.graphql(`#graphql
    query GetAiSeoAssistantSettings($namespace: String!, $key: String!) {
      shop {
        id
        metafield(namespace: $namespace, key: $key) {
          id
          type
          value
        }
      }
    }`, { variables: {
		namespace: SETTINGS_NAMESPACE$2,
		key: SETTINGS_KEY$2
	} })).json())?.data?.shop?.metafield?.value;
	let settings = null;
	if (raw) try {
		settings = JSON.parse(raw);
	} catch {
		settings = null;
	}
	return settings || {};
}
function jsonResponse$2(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json; charset=utf-8" }
	});
}
var loader$7 = async ({ request }) => {
	const { admin, session } = await authenticate.admin(request);
	const settings = await getSettingsFromMetafield$2(admin);
	const billingCtx = await getBillingContext(session.shop);
	const billing = {
		planKey: billingCtx.planKey,
		isPro: billingCtx.isPro,
		mode: billingCtx.mode,
		free: billingCtx.free
	};
	const [totalJobs, productJobs, imageJobs, blogJobs] = await Promise.all([
		prisma.seoJob.count({ where: { shop: session.shop } }),
		prisma.seoJob.count({ where: {
			shop: session.shop,
			jobType: "PRODUCT_SEO"
		} }),
		prisma.seoJob.count({ where: {
			shop: session.shop,
			jobType: "ALT_TEXT_IMAGES"
		} }),
		prisma.seoJob.count({ where: {
			shop: session.shop,
			jobType: "BLOG_SEO_META"
		} })
	]);
	return jsonResponse$2({
		shop: session.shop,
		settings,
		billing,
		stats: {
			totalJobs,
			productJobs,
			imageJobs,
			blogJobs
		}
	});
};
function clamp(n, min, max) {
	return Math.max(min, Math.min(max, n));
}
function StretchCard({ children }) {
	return /* @__PURE__ */ jsx("div", {
		className: "gsCardWrap",
		children: /* @__PURE__ */ jsx(Card, { children })
	});
}
var app_onboarding_default = UNSAFE_withComponentProps(function Onboarding() {
	const { settings, billing, stats } = useLoaderData();
	const location = useLocation();
	const withSearch = (path) => `${path}${location.search || ""}`;
	const isConfigured = settings && (settings.brandName || settings.brandVoiceGuidelines || settings.targetKeyword);
	const stepSettings = Boolean(isConfigured);
	const stepProduct = (stats?.productJobs || 0) > 0;
	const stepReview = (stats?.totalJobs || 0) > 0;
	const stepImages = (stats?.imageJobs || 0) > 0;
	const stepBlog = (stats?.blogJobs || 0) > 0;
	const steps = [
		{
			key: "settings",
			label: "Complete Settings",
			done: stepSettings,
			href: "/app/settings"
		},
		{
			key: "product",
			label: "Generate SEO for products",
			done: stepProduct,
			href: "/app/seo-tools?tab=products"
		},
		{
			key: "review",
			label: "Review results in Generation History",
			done: stepReview,
			href: "/app/generation-history"
		},
		{
			key: "images",
			label: "Generate ALT text for images",
			done: stepImages,
			href: "/app/seo-tools?tab=images",
			proOnly: true
		},
		{
			key: "blog",
			label: "Generate SEO for blog articles",
			done: stepBlog,
			href: "/app/seo-tools?tab=blog",
			proOnly: true
		}
	];
	const doneCount = steps.filter((s) => s.done).length;
	const progress = clamp(Math.round(doneCount / steps.length * 100), 0, 100);
	const freeUsed = billing?.free?.used || 0;
	const freeLimit = billing?.free?.limit || billing?.free?.monthlyLimit || 0;
	const freeRemaining = typeof billing?.free?.remaining === "number" ? billing.free.remaining : Math.max(0, freeLimit - freeUsed);
	return /* @__PURE__ */ jsx(Page, {
		title: "Get started",
		fullWidth: true,
		children: /* @__PURE__ */ jsxs("div", {
			style: {
				width: "100%",
				padding: "0"
			},
			children: [/* @__PURE__ */ jsx("style", { children: `

.gsRows {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}
.gsRow {
  display: flex;
  gap: 16px;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
}
.gsCol {
  /* Strict 50/50 columns (gap-aware) */
  flex: 0 0 calc(50% - 8px);
  max-width: calc(50% - 8px);
  min-width: 0;
  display: flex;
  box-sizing: border-box;
}

.gsCardWrap {
  flex: 1;
  display: flex;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.gsCardWrap .Polaris-Card {
  flex: 1;
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.gsCardWrap .Polaris-Card__Section { flex: 1; }

@media (max-width: 768px) {
  .gsRow { flex-direction: column; }
  .gsCol { flex: 0 0 100%; max-width: 100%; }
}
` }), /* @__PURE__ */ jsxs("div", {
				className: "gsRows",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "gsRow",
						children: [/* @__PURE__ */ jsx("div", {
							className: "gsCol",
							children: /* @__PURE__ */ jsx(StretchCard, { children: /* @__PURE__ */ jsxs(BlockStack, {
								gap: "400",
								children: [
									/* @__PURE__ */ jsxs(InlineStack, {
										align: "space-between",
										blockAlign: "center",
										children: [/* @__PURE__ */ jsxs(BlockStack, {
											gap: "100",
											children: [/* @__PURE__ */ jsx(Text, {
												as: "h2",
												variant: "headingMd",
												children: "Onboarding checklist"
											}), /* @__PURE__ */ jsxs(Text, {
												as: "p",
												variant: "bodySm",
												children: [
													doneCount,
													" / ",
													steps.length,
													" completed"
												]
											})]
										}), /* @__PURE__ */ jsxs(Badge, {
											tone: progress === 100 ? "success" : "info",
											children: [progress, "%"]
										})]
									}),
									/* @__PURE__ */ jsx(ProgressBar, { progress }),
									/* @__PURE__ */ jsx(Divider, {}),
									/* @__PURE__ */ jsx(List, {
										type: "bullet",
										children: steps.map((s) => {
											const locked = Boolean(s.proOnly) && !billing?.isPro;
											return /* @__PURE__ */ jsx(List.Item, { children: /* @__PURE__ */ jsxs(InlineStack, {
												align: "space-between",
												blockAlign: "center",
												children: [/* @__PURE__ */ jsxs(InlineStack, {
													gap: "200",
													blockAlign: "center",
													children: [/* @__PURE__ */ jsx(Badge, {
														tone: s.done ? "success" : locked ? "critical" : "info",
														children: s.done ? "Done" : locked ? "Pro" : "Todo"
													}), /* @__PURE__ */ jsx(Text, {
														as: "span",
														variant: "bodyMd",
														children: s.label
													})]
												}), /* @__PURE__ */ jsx(Button, {
													size: "slim",
													disabled: locked,
													url: withSearch(s.href),
													variant: s.done ? "secondary" : "primary",
													children: s.done ? "Open" : locked ? "Upgrade" : "Start"
												})]
											}) }, s.key);
										})
									})
								]
							}) })
						}), /* @__PURE__ */ jsx("div", {
							className: "gsCol",
							children: /* @__PURE__ */ jsx(StretchCard, { children: /* @__PURE__ */ jsxs(BlockStack, {
								gap: "400",
								children: [
									/* @__PURE__ */ jsx(Text, {
										as: "h2",
										variant: "headingMd",
										children: "Quick actions"
									}),
									/* @__PURE__ */ jsxs(InlineStack, {
										gap: "300",
										wrap: true,
										children: [
											/* @__PURE__ */ jsx(Button, {
												variant: "primary",
												url: withSearch("/app/seo-tools?tab=products"),
												children: "Generate for products"
											}),
											/* @__PURE__ */ jsx(Button, {
												disabled: !billing?.isPro,
												url: withSearch("/app/seo-tools?tab=images"),
												children: "Generate ALT for images"
											}),
											/* @__PURE__ */ jsx(Button, {
												disabled: !billing?.isPro,
												url: withSearch("/app/seo-tools?tab=blog"),
												children: "Generate for blog articles"
											}),
											/* @__PURE__ */ jsx(Button, {
												url: withSearch("/app/generation-history"),
												children: "View history"
											})
										]
									}),
									!billing?.isPro ? /* @__PURE__ */ jsx(Text, {
										as: "p",
										variant: "bodySm",
										tone: "subdued",
										children: "Image ALT and Blog generators are Pro features."
									}) : null
								]
							}) })
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "gsRow",
						children: [/* @__PURE__ */ jsx("div", {
							className: "gsCol",
							children: /* @__PURE__ */ jsx(StretchCard, { children: /* @__PURE__ */ jsxs(BlockStack, {
								gap: "300",
								children: [/* @__PURE__ */ jsx(Text, {
									as: "h2",
									variant: "headingMd",
									children: "Plan & limits"
								}), !billing?.isPro ? /* @__PURE__ */ jsxs(Banner, {
									tone: "info",
									title: "Free plan limits",
									action: {
										content: "Upgrade to Pro",
										url: withSearch("/app/billing")
									},
									children: [/* @__PURE__ */ jsx(Text, {
										as: "p",
										variant: "bodyMd",
										children: "Product SEO generation is available with a monthly limit. Image ALT and Blog SEO are Pro features."
									}), freeLimit ? /* @__PURE__ */ jsxs(Text, {
										as: "p",
										variant: "bodyMd",
										children: [
											"Monthly product usage: ",
											/* @__PURE__ */ jsx("b", { children: freeUsed }),
											" / ",
											/* @__PURE__ */ jsx("b", { children: freeLimit }),
											" (remaining: ",
											/* @__PURE__ */ jsx("b", { children: freeRemaining }),
											")"
										]
									}) : null]
								}) : /* @__PURE__ */ jsx(Banner, {
									tone: "success",
									title: "Pro plan active",
									children: /* @__PURE__ */ jsx(Text, {
										as: "p",
										variant: "bodyMd",
										children: "All generators are unlocked."
									})
								})]
							}) })
						}), /* @__PURE__ */ jsx("div", {
							className: "gsCol",
							children: /* @__PURE__ */ jsx(StretchCard, { children: /* @__PURE__ */ jsxs(BlockStack, {
								gap: "300",
								children: [
									/* @__PURE__ */ jsx(Text, {
										as: "h2",
										variant: "headingMd",
										children: "Activity"
									}),
									/* @__PURE__ */ jsxs(Text, {
										as: "p",
										variant: "bodyMd",
										children: ["Product jobs: ", /* @__PURE__ */ jsx("b", { children: stats?.productJobs || 0 })]
									}),
									/* @__PURE__ */ jsxs(Text, {
										as: "p",
										variant: "bodyMd",
										children: ["Image jobs: ", /* @__PURE__ */ jsx("b", { children: stats?.imageJobs || 0 })]
									}),
									/* @__PURE__ */ jsxs(Text, {
										as: "p",
										variant: "bodyMd",
										children: ["Blog jobs: ", /* @__PURE__ */ jsx("b", { children: stats?.blogJobs || 0 })]
									}),
									/* @__PURE__ */ jsxs(Text, {
										as: "p",
										variant: "bodyMd",
										children: ["Total jobs: ", /* @__PURE__ */ jsx("b", { children: stats?.totalJobs || 0 })]
									}),
									/* @__PURE__ */ jsx(Divider, {}),
									/* @__PURE__ */ jsx(Text, {
										as: "p",
										variant: "bodySm",
										tone: "subdued",
										children: "Tip: Start with 5–10 products, review the results, then scale up."
									})
								]
							}) })
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "gsRow",
						children: [/* @__PURE__ */ jsx("div", {
							className: "gsCol",
							children: /* @__PURE__ */ jsx(StretchCard, { children: /* @__PURE__ */ jsxs(BlockStack, {
								gap: "300",
								children: [/* @__PURE__ */ jsx(Text, {
									as: "h2",
									variant: "headingMd",
									children: "Best practices"
								}), /* @__PURE__ */ jsxs(List, {
									type: "bullet",
									children: [
										/* @__PURE__ */ jsx(List.Item, { children: "Keep titles under ~60 characters." }),
										/* @__PURE__ */ jsx(List.Item, { children: "Use one clear keyword, avoid stuffing." }),
										/* @__PURE__ */ jsx(List.Item, { children: "Write descriptions that match the product and audience." }),
										/* @__PURE__ */ jsx(List.Item, { children: "ALT text: describe what you see + product context." })
									]
								})]
							}) })
						}), /* @__PURE__ */ jsx("div", {
							className: "gsCol",
							children: /* @__PURE__ */ jsx(StretchCard, { children: /* @__PURE__ */ jsxs(BlockStack, {
								gap: "300",
								children: [
									/* @__PURE__ */ jsx(Text, {
										as: "h2",
										variant: "headingMd",
										children: "Shortcuts"
									}),
									/* @__PURE__ */ jsxs(InlineStack, {
										gap: "200",
										wrap: true,
										children: [
											/* @__PURE__ */ jsx(Button, {
												url: withSearch("/app/seo-tools"),
												children: "SEO Tools"
											}),
											/* @__PURE__ */ jsx(Button, {
												url: withSearch("/app/generation-history"),
												children: "Generation History"
											}),
											/* @__PURE__ */ jsx(Button, {
												url: withSearch("/app/settings"),
												children: "Settings"
											}),
											/* @__PURE__ */ jsx(Button, {
												url: withSearch("/app/billing"),
												children: "Billing"
											})
										]
									}),
									!isConfigured ? /* @__PURE__ */ jsx(Text, {
										as: "p",
										variant: "bodySm",
										tone: "subdued",
										children: "Complete Settings to get the best results."
									}) : null
								]
							}) })
						})]
					})
				]
			})]
		})
	});
});
var headers$4 = (headersArgs) => boundary.headers(headersArgs);
//#endregion
//#region app/routes/app.seo-tools.jsx
var app_seo_tools_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$2,
	action: () => action$3,
	default: () => app_seo_tools_default,
	loader: () => loader$6
});
var SETTINGS_NAMESPACE$1 = "ai_seo_assistant";
var SETTINGS_KEY$1 = "settings";
async function getSettingsFromMetafield$1(admin) {
	const raw = (await (await admin.graphql(`#graphql
    query GetAiSeoAssistantSettings($namespace: String!, $key: String!) {
      shop {
        metafield(namespace: $namespace, key: $key) { value }
      }
    }`, { variables: {
		namespace: SETTINGS_NAMESPACE$1,
		key: SETTINGS_KEY$1
	} })).json())?.data?.shop?.metafield?.value;
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
/** ----------------------- Response helper ----------------------- **/
function jsonResponse$1(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json; charset=utf-8" }
	});
}
function safeParse(json, fallback) {
	try {
		return JSON.parse(json);
	} catch {
		return fallback;
	}
}
function sanitizeLanguage(input) {
	const m = String(input || "").trim().toLowerCase().match(/^[a-z]{2}/);
	return m ? m[0] : "tr";
}
/** ----------------------- Shopify helpers ----------------------- **/
async function listProducts(admin, q, opts = {}) {
	const limit = Number(opts.limit || 25);
	const after = opts.after || null;
	const before = opts.before || null;
	const query = `#graphql
    query Products($first: Int, $after: String, $last: Int, $before: String, $query: String) {
      productsCount(query: $query) {
        count
      }
      products(first: $first, after: $after, last: $last, before: $before, query: $query) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          cursor
          node {
            id
            title
            description
            status
            featuredImage { url altText }
            seo { title description }
            tags
            productType
          }
        }
      }
    }
  `;
	const variables = {
		query: q || null,
		first: before ? null : limit,
		after: before ? null : after,
		last: before ? limit : null,
		before
	};
	const json = await (await admin.graphql(query, { variables })).json();
	const connection = json?.data?.products;
	return {
		items: (connection?.edges || []).map((e) => e.node),
		pageInfo: connection?.pageInfo || {
			hasNextPage: false,
			hasPreviousPage: false,
			startCursor: null,
			endCursor: null
		},
		totalCount: Number(json?.data?.productsCount?.count ?? 0)
	};
}
async function listCollections(admin) {
	return ((await (await admin.graphql(`#graphql
    query Collections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `, { variables: { first: 50 } })).json())?.data?.collections?.edges || []).map((e) => ({
		id: e.node.id,
		title: e.node.title
	}));
}
async function listProductImages(admin, q) {
	return ((await (await admin.graphql(`#graphql
    query ProductsWithImages($first: Int!, $query: String) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            description
            status
            featuredImage { url altText }
            media(first: 20) {
              edges {
                node {
                  __typename
                  ... on MediaImage {
                    id
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `, { variables: {
		first: 25,
		query: q || null
	} })).json())?.data?.products?.edges || []).map((e) => e.node).map((p) => {
		const images = (p?.media?.edges || []).map((me) => me?.node).filter((n) => n?.__typename === "MediaImage" && n?.image?.url).map((n) => ({
			mediaId: String(n.id),
			url: String(n.image.url),
			altText: n.image.altText ? String(n.image.altText) : ""
		}));
		return {
			id: String(p.id),
			title: p.title,
			status: p.status,
			featuredImage: p.featuredImage || null,
			images
		};
	});
}
async function listBlogArticles(admin) {
	const json = await (await admin.graphql(`#graphql
    query BlogsWithArticles($blogsFirst: Int!, $articlesFirst: Int!) {
      blogs(first: $blogsFirst) {
        edges {
          node {
            id
            title
            articles(first: $articlesFirst) {
              edges {
                node {
                  id
                  title
                  handle
                  publishedAt
                  titleTag: metafield(namespace: "global", key: "title_tag") { value }
                  descriptionTag: metafield(namespace: "global", key: "description_tag") { value }
                }
              }
            }
          }
        }
      }
    }
  `, { variables: {
		blogsFirst: 10,
		articlesFirst: 50
	} })).json();
	if (json?.errors?.length) {
		const message = json.errors.map((e) => e.message).join(" | ");
		throw new Error(`Blog articles fetch failed: ${message}`);
	}
	const blogs = json?.data?.blogs?.edges?.map((e) => e.node) || [];
	const out = [];
	for (const b of blogs) {
		const edges = b?.articles?.edges || [];
		for (const e of edges) {
			const a = e.node;
			const titleTag = a?.titleTag?.value || "";
			const descTag = a?.descriptionTag?.value || "";
			out.push({
				id: String(a.id),
				title: a.title,
				blogTitle: b.title,
				isPublished: Boolean(a.publishedAt),
				publishedAt: a.publishedAt,
				seoTitle: titleTag,
				seoDescription: descTag
			});
		}
	}
	return out;
}
function buildShopifyProductQuery({ queryValue, statusTab, tag, category, collection, meta }) {
	const parts = [];
	const q = String(queryValue || "").trim();
	if (q) parts.push(q);
	if (statusTab === "active") parts.push("status:active");
	if (statusTab === "draft") parts.push("status:draft");
	if (statusTab === "archived") parts.push("status:archived");
	const normList = (val) => String(val || "").split(",").map((s) => s.trim()).filter(Boolean);
	const qVal = (v) => /[\s"]/g.test(v) ? `"${v.replace(/"/g, "\\\"")}"` : v;
	const orGroup = (prefix, values) => {
		const vs = normList(values);
		if (!vs.length) return "";
		if (vs.length === 1) return `${prefix}${qVal(vs[0])}`;
		return `(${vs.map((x) => `${prefix}${qVal(x)}`).join(" OR ")})`;
	};
	const tagPart = orGroup("tag:", tag);
	if (tagPart) parts.push(tagPart);
	const catPart = orGroup("product_type:", category);
	if (catPart) parts.push(catPart);
	const colPart = orGroup("collection:", collection);
	if (colPart) parts.push(colPart);
	return parts.filter(Boolean).join(" ");
}
/** ----------------------- Loader / Action ----------------------- **/
var loader$6 = async ({ request }) => {
	const { admin, session } = await authenticate.admin(request);
	const url = new URL(request.url);
	const tab = url.searchParams.get("tab") || "products";
	const queryValue = url.searchParams.get("q") || "";
	const statusTab = url.searchParams.get("status") || "all";
	const tag = url.searchParams.get("tag") || "";
	const category = url.searchParams.get("category") || "";
	const collection = url.searchParams.get("collection") || "";
	const meta = url.searchParams.get("meta") || "";
	const limit = Math.max(1, Math.min(250, Number(url.searchParams.get("limit") || 25)));
	const after = url.searchParams.get("after") || "";
	const before = url.searchParams.get("before") || "";
	const settings = await getSettingsFromMetafield$1(admin);
	const lang = sanitizeLanguage(settings?.language || url.searchParams.get("lang") || "tr");
	const shopifyQuery = buildShopifyProductQuery({
		queryValue,
		statusTab,
		tag,
		category,
		collection,
		meta
	});
	const productsResult = tab === "products" ? await listProducts(admin, shopifyQuery, {
		limit,
		after: after || null,
		before: before || null
	}) : {
		items: [],
		pageInfo: null,
		totalCount: 0
	};
	const products = productsResult.items;
	const productsPageInfo = productsResult.pageInfo;
	const collections = tab === "products" ? await listCollections(admin) : [];
	const imageProducts = tab === "images" ? await listProductImages(admin, shopifyQuery) : [];
	let blogArticles = [];
	let blogError = "";
	if (tab === "articles") try {
		blogArticles = await listBlogArticles(admin);
	} catch (e) {
		blogError = e?.message || String(e);
		blogArticles = [];
	}
	const billing = await getBillingContext(session.shop);
	return jsonResponse$1({
		shop: session.shop,
		tab,
		lang,
		settings,
		products,
		productsPageInfo,
		productsPageSize: limit,
		productsTotalCount: productsResult.totalCount,
		collections,
		imageProducts,
		blogArticles,
		blogError,
		billing: {
			isPro: billing.isPro,
			planKey: billing.planKey,
			mode: billing.mode,
			free: billing.free
		},
		filters: {
			queryValue,
			statusTab,
			tag,
			category,
			collection,
			meta
		}
	});
};
var action$3 = async ({ request }) => {
	const { admin, session } = await authenticate.admin(request);
	const form = await request.formData();
	const intent = String(form.get("intent") || "");
	const billing = await getBillingContext(session.shop);
	if (intent === "update_image_alt") {
		const productId = String(form.get("productId") || "").trim();
		const mediaId = String(form.get("mediaId") || "").trim();
		const altText = String(form.get("altText") || "");
		if (!productId || !mediaId) return jsonResponse$1({
			ok: false,
			error: "Missing productId or mediaId"
		}, 400);
		const mutation = `#graphql
      mutation UpdateMediaAltText($productId: ID!, $media: [UpdateMediaInput!]!) {
        productUpdateMedia(productId: $productId, media: $media) {
          media {
            __typename
            ... on MediaImage {
              id
              image { altText }
            }
          }
          mediaUserErrors { field message }
          userErrors { field message }
        }
      }
    `;
		const variables = {
			productId,
			media: [{
				id: mediaId,
				alt: altText
			}]
		};
		const json = await (await admin.graphql(mutation, { variables })).json();
		const payload = json?.data?.productUpdateMedia;
		const errors = [
			...payload?.mediaUserErrors || [],
			...payload?.userErrors || [],
			...json?.errors || []
		].map((e) => e?.message || (typeof e === "string" ? e : null)).filter(Boolean);
		if (errors.length) return jsonResponse$1({
			ok: false,
			error: errors.join(" | ")
		}, 400);
		const updatedAlt = (payload?.media || []).find((m) => String(m?.id || "") === mediaId)?.image?.altText ?? altText;
		return jsonResponse$1({
			ok: true,
			mediaId,
			altText: String(updatedAlt || "")
		});
	}
	if (intent === "start_generate") {
		const productIds = safeParse(String(form.get("productIds") || "[]"), []).map(String).filter(Boolean);
		if (!productIds.length) return jsonResponse$1({
			ok: false,
			error: "No selected items"
		}, 400);
		const reservation = await reserveIfFreePlan({
			shop: session.shop,
			productCount: productIds.length
		});
		if (!reservation.ok) return jsonResponse$1({
			ok: false,
			code: reservation.code || "FREE_LIMIT_EXCEEDED",
			error: "Free plan limit exceeded",
			billing: {
				planKey: reservation.planKey,
				mode: reservation.mode,
				free: reservation.free,
				limit: BILLING_PLANS.FREE.monthlyProductLimit
			}
		}, 402);
		const metaTitle = String(form.get("metaTitle") || "true") === "true";
		const metaDescription = String(form.get("metaDescription") || "true") === "true";
		const formSettings = safeParse(String(form.get("settingsJson") || "{}"), {});
		const settings = await getSettingsFromMetafield$1(admin) || formSettings || {};
		const language = sanitizeLanguage(settings?.language || form.get("language") || "tr");
		const titlesById = safeParse(String(form.get("titlesByIdJson") || "{}"), {});
		const job = await createGenerateJob({
			shop: session.shop,
			seed: {
				language,
				settings,
				fields: {
					metaTitle,
					metaDescription
				}
			},
			usageReserved: true,
			productIds,
			productTitlesById: titlesById
		});
		await enqueueSeoJob(job.id);
		return jsonResponse$1({
			ok: true,
			jobId: job.id
		});
	}
	if (intent === "start_generate_images") {
		if (!billing.isPro) return jsonResponse$1({
			ok: false,
			code: "PRO_REQUIRED",
			error: "Image ALT text generation is available on Pro.",
			billing: {
				planKey: billing.planKey,
				mode: billing.mode,
				free: billing.free
			}
		}, 402);
		const imagesRaw = safeParse(String(form.get("imagesJson") || "[]"), []).map((x) => ({
			productId: x?.productId ? String(x.productId) : null,
			productTitle: x?.productTitle ? String(x.productTitle) : null,
			mediaId: x?.mediaId ? String(x.mediaId) : "",
			imageUrl: x?.imageUrl ? String(x.imageUrl) : null,
			currentAltText: x?.currentAltText ? String(x.currentAltText) : ""
		})).filter((x) => Boolean(x.mediaId));
		const images = Array.from(new Map(imagesRaw.map((img) => [String(img.mediaId), img])).values());
		if (!images.length) return jsonResponse$1({
			ok: false,
			error: "No selected images"
		}, 400);
		const reservation = await reserveIfFreePlan({
			shop: session.shop,
			productCount: images.length
		});
		if (!reservation.ok) return jsonResponse$1({
			ok: false,
			code: reservation.code || "FREE_LIMIT_EXCEEDED",
			error: "Free plan limit exceeded",
			billing: {
				planKey: reservation.planKey,
				mode: reservation.mode,
				free: reservation.free,
				limit: BILLING_PLANS.FREE.monthlyProductLimit
			}
		}, 402);
		const formSettings = safeParse(String(form.get("settingsJson") || "{}"), {});
		const settings = await getSettingsFromMetafield$1(admin) || formSettings || {};
		const language = sanitizeLanguage(settings?.language || form.get("language") || "tr");
		const job = await createAltTextJob({
			shop: session.shop,
			seed: {
				language,
				settings
			},
			usageReserved: true,
			images
		});
		await enqueueSeoJob(job.id);
		return jsonResponse$1({
			ok: true,
			jobId: job.id
		});
	}
	if (intent === "start_generate_blog") {
		if (!billing.isPro) return jsonResponse$1({
			ok: false,
			code: "PRO_REQUIRED",
			error: "Blog article generation is available on Pro.",
			billing: {
				planKey: billing.planKey,
				mode: billing.mode,
				free: billing.free
			}
		}, 402);
		const articleIds = safeParse(String(form.get("articleIds") || "[]"), []).map(String).filter(Boolean);
		if (!articleIds.length) return jsonResponse$1({
			ok: false,
			error: "No selected articles"
		}, 400);
		const reservation = await reserveIfFreePlan({
			shop: session.shop,
			productCount: articleIds.length
		});
		if (!reservation.ok) return jsonResponse$1({
			ok: false,
			code: reservation.code || "FREE_LIMIT_EXCEEDED",
			error: "Free plan limit exceeded",
			billing: {
				planKey: reservation.planKey,
				mode: reservation.mode,
				free: reservation.free,
				limit: BILLING_PLANS.FREE.monthlyProductLimit
			}
		}, 402);
		const formSettings = safeParse(String(form.get("settingsJson") || "{}"), {});
		const settings = await getSettingsFromMetafield$1(admin) || formSettings || {};
		const language = sanitizeLanguage(settings?.language || form.get("language") || "tr");
		const titlesById = safeParse(String(form.get("titlesJson") || "{}"), {});
		const articles = articleIds.map((id) => ({
			articleId: id,
			title: titlesById?.[id] || null
		}));
		const job = await createBlogMetaJob({
			shop: session.shop,
			seed: {
				language,
				settings
			},
			usageReserved: true,
			articles
		});
		await enqueueSeoJob(job.id);
		return jsonResponse$1({
			ok: true,
			jobId: job.id
		});
	}
	return jsonResponse$1({
		ok: false,
		error: "Unknown intent"
	}, 400);
};
/** ----------------------- UI helpers ----------------------- **/
function toStoreHandle(shopDomain) {
	if (!shopDomain) return "";
	return String(shopDomain).replace(/\.myshopify\.com$/i, "");
}
function gidToNumericId(gid) {
	const m = String(gid || "").match(/\/Product\/(\d+)$/);
	return m ? m[1] : "";
}
function productAdminUrl({ shopDomain, productGid }) {
	const handle = toStoreHandle(shopDomain);
	const id = gidToNumericId(productGid);
	if (!handle || !id) return "";
	return `https://admin.shopify.com/store/${handle}/products/${id}`;
}
function normalizeStatus(raw) {
	const s = String(raw || "").trim().toUpperCase();
	if (s === "AKTIF" || s === "AKTİF") return "ACTIVE";
	if (s === "TASLAK") return "DRAFT";
	if (s === "ARŞİVLENMİŞ" || s === "ARSIVLENMIS" || s === "ARŞIVLENMIŞ") return "ARCHIVED";
	return s;
}
function statusLabelTr(norm) {
	if (norm === "ACTIVE") return "Active";
	if (norm === "DRAFT") return "Draft";
	if (norm === "ARCHIVED") return "Archived";
	return "—";
}
function truncate(value, max = 80) {
	if (value == null) return "";
	const s = String(value);
	if (s.length <= max) return s;
	const cut = Math.max(0, max - 1);
	return s.slice(0, cut).trimEnd() + "…";
}
function statusTone(norm) {
	if (norm === "ACTIVE") return "success";
	if (norm === "DRAFT") return "attention";
	if (norm === "ARCHIVED") return "subdued";
	return "subdued";
}
/** ----------------------- Component ----------------------- **/
var app_seo_tools_default = UNSAFE_withComponentProps(function SeoTools() {
	const data = useLoaderData();
	data?.blogError;
	const startGenFetcher = useFetcher();
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const suppressUrlSyncRef = useRef(false);
	const productsUrlSyncTimerRef = useRef(null);
	const blogUrlSyncTimerRef = useRef(null);
	const shopDomain = useMemo(() => {
		try {
			return new URLSearchParams(location.search || "").get("shop") || "";
		} catch {
			return "";
		}
	}, [location.search]);
	useEffect(() => {
		if (startGenFetcher.state !== "idle") return;
		if (!startGenFetcher.data?.ok || !startGenFetcher.data?.jobId) return;
		navigate(`/app/generation-history?${new URLSearchParams(location.search || "").toString()}`);
	}, [
		startGenFetcher.state,
		startGenFetcher.data,
		navigate,
		location.search
	]);
	const selectedTab = data.tab || "products";
	const tabs = useMemo(() => [
		{
			id: "products",
			content: "Products"
		},
		{
			id: "images",
			content: "Images"
		},
		{
			id: "articles",
			content: "Blog articles"
		}
	], []);
	const products = data.products || [];
	const collections = data.collections || [];
	const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(products, { resourceIDResolver: (p) => p.id });
	const imageProducts = data.imageProducts || [];
	const imageRows = useMemo(() => {
		const rows = [];
		for (const p of imageProducts || []) {
			const productId = String(p?.id || "");
			const productTitle = String(p?.title || "");
			const productStatus = normalizeStatus(p?.status);
			for (const img of p?.images || []) {
				const mediaId = String(img?.mediaId || "");
				const url = String(img?.url || "");
				if (!mediaId || !url) continue;
				rows.push({
					mediaId,
					url,
					altText: String(img?.altText || ""),
					productId,
					productTitle,
					productStatus
				});
			}
		}
		return rows;
	}, [imageProducts]);
	const [imageAltOverrides, setImageAltOverrides] = useState({});
	const [imageFiltersMode, setImageFiltersMode] = useState(IndexFiltersMode.Default);
	const [imageQueryValue, setImageQueryValue] = useState(String(searchParams.get("img_q") || ""));
	const [imageAltTab, setImageAltTab] = useState(String(searchParams.get("img_alt") || "all"));
	const [imageStatusSelected, setImageStatusSelected] = useState(() => {
		const raw = String(searchParams.get("img_status") || "").trim();
		return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
	});
	const imageSearchInputRef = useRef(null);
	const [imagePreviewRow, setImagePreviewRow] = useState(null);
	const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
	const [imageAltDraft, setImageAltDraft] = useState("");
	const [imageAltSaveError, setImageAltSaveError] = useState(null);
	const updateAltFetcher = useFetcher();
	useEffect(() => {
		if (updateAltFetcher.state !== "idle") return;
		if (!updateAltFetcher.data) return;
		if (!updateAltFetcher.data.ok) {
			setImageAltSaveError(updateAltFetcher.data.error || "Failed to update ALT text");
			return;
		}
		const mediaId = String(updateAltFetcher.data.mediaId || "");
		const nextAlt = String(updateAltFetcher.data.altText || "");
		if (!mediaId) return;
		setImageAltOverrides((prev) => ({
			...prev,
			[mediaId]: nextAlt
		}));
		setImagePreviewRow((prev) => {
			if (!prev || String(prev.mediaId) !== mediaId) return prev;
			return {
				...prev,
				altText: nextAlt
			};
		});
		setImageAltDraft(nextAlt);
		setImageAltSaveError(null);
		setIsImagePreviewOpen(false);
	}, [updateAltFetcher.state, updateAltFetcher.data]);
	const openImagePreview = useCallback((row) => {
		const r = row || null;
		setImagePreviewRow(r);
		const mediaId = r?.mediaId ? String(r.mediaId) : "";
		setImageAltDraft(mediaId && Object.prototype.hasOwnProperty.call(imageAltOverrides, mediaId) ? String(imageAltOverrides[mediaId] || "") : String(r?.altTextEffective ?? r?.altText ?? ""));
		setImageAltSaveError(null);
		setIsImagePreviewOpen(true);
	}, [imageAltOverrides]);
	const closeImagePreview = useCallback(() => {
		setIsImagePreviewOpen(false);
	}, []);
	const imageTabs = useMemo(() => [
		{
			id: "all",
			content: "All"
		},
		{
			id: "empty",
			content: "ALT Empty"
		},
		{
			id: "filled",
			content: "ALT Filled"
		}
	], []);
	const onImageAltTabClick = useCallback((key) => {
		setImageAltTab(key);
		const next = new URLSearchParams(searchParams);
		next.set("tab", "images");
		if (key && key !== "all") next.set("img_alt", key);
		else next.delete("img_alt");
		setSearchParams(next);
	}, [searchParams, setSearchParams]);
	const onImageQueryChange = useCallback((value) => {
		setImageQueryValue(value);
		const next = new URLSearchParams(searchParams);
		next.set("tab", "images");
		if (value) next.set("img_q", value);
		else next.delete("img_q");
		setSearchParams(next);
	}, [searchParams, setSearchParams]);
	const onImageStatusChange = useCallback((values) => {
		const arr = Array.isArray(values) ? values : [];
		setImageStatusSelected(arr);
		const next = new URLSearchParams(searchParams);
		next.set("tab", "images");
		if (arr.length) next.set("img_status", arr.join(","));
		else next.delete("img_status");
		setSearchParams(next);
	}, [searchParams, setSearchParams]);
	const imageFilters = useMemo(() => {
		return [{
			key: "imgStatus",
			label: "Product status",
			filter: /* @__PURE__ */ jsx(ChoiceList, {
				title: "Product status",
				choices: [
					{
						label: "Active",
						value: "ACTIVE"
					},
					{
						label: "Draft",
						value: "DRAFT"
					},
					{
						label: "Archived",
						value: "ARCHIVED"
					}
				],
				selected: imageStatusSelected,
				allowMultiple: true,
				onChange: onImageStatusChange
			}),
			shortcut: true
		}];
	}, [imageStatusSelected, onImageStatusChange]);
	const imageAppliedFilters = useMemo(() => {
		const out = [];
		if (Array.isArray(imageStatusSelected) && imageStatusSelected.length) {
			const labels = imageStatusSelected.map((v) => statusLabelTr(v));
			const preview = labels.slice(0, 2).join(", ");
			out.push({
				key: "imgStatus",
				label: `Product status: ${preview}${labels.length > 2 ? ` +${labels.length - 2}` : ""}`,
				onRemove: () => onImageStatusChange([])
			});
		}
		return out;
	}, [imageStatusSelected, onImageStatusChange]);
	const filteredImageRows = useMemo(() => {
		const q = String(imageQueryValue || "").trim().toLowerCase();
		const statuses = Array.isArray(imageStatusSelected) ? imageStatusSelected : [];
		const altTab = String(imageAltTab || "all");
		return (imageRows || []).map((r) => {
			const mediaId = String(r.mediaId || "");
			const override = mediaId && Object.prototype.hasOwnProperty.call(imageAltOverrides, mediaId) ? String(imageAltOverrides[mediaId] || "") : null;
			return {
				...r,
				altTextEffective: override !== null ? override : String(r.altText || "")
			};
		}).filter((r) => {
			const hasAlt = Boolean(String(r.altTextEffective || "").trim());
			if (altTab === "empty" && hasAlt) return false;
			if (altTab === "filled" && !hasAlt) return false;
			if (statuses.length && !statuses.includes(String(r.productStatus || ""))) return false;
			if (!q) return true;
			return String(r.productTitle || "").toLowerCase().includes(q);
		});
	}, [
		imageRows,
		imageQueryValue,
		imageAltTab,
		imageStatusSelected,
		imageAltOverrides
	]);
	const { selectedResources: selectedImageResources, allResourcesSelected: allImagesSelected, handleSelectionChange: handleImageSelectionChange } = useIndexResourceState(filteredImageRows, { resourceIDResolver: (r) => r.mediaId });
	const [blogFiltersMode, setBlogFiltersMode] = useState(IndexFiltersMode.Default);
	const [blogSeoStatus, setBlogSeoStatus] = useState(String(searchParams.get("article_meta") || ""));
	const [blogSeoPopoverActive, setBlogSeoPopoverActive] = useState(false);
	const [blogQueryValue, setBlogQueryValue] = useState(String(searchParams.get("article_q") || ""));
	const [blogStatusTab, setBlogStatusTab] = useState(String(searchParams.get("article_status") || "all"));
	const [blogNamesSelected, setBlogNamesSelected] = useState(() => {
		const raw = String(searchParams.get("article_blog") || "").trim();
		return raw ? raw.split(",").map((s) => s.trim()).filter(Boolean) : [];
	});
	const [blogStatusSelected, setBlogStatusSelected] = useState("");
	const [blogPopoverActive, setBlogPopoverActive] = useState(false);
	const [blogStatusPopoverActive, setBlogStatusPopoverActive] = useState(false);
	const [blogAddFilterPopoverActive, setBlogAddFilterPopoverActive] = useState(false);
	const blogArticles = data.blogArticles || [];
	const blogNameChoices = useMemo(() => {
		return Array.from(new Set((blogArticles || []).map((a) => a?.blogTitle || a?.blog || a?.blogName).filter(Boolean))).map((b) => ({
			label: b,
			value: b
		}));
	}, [blogArticles]);
	const filteredBlogArticles = useMemo(() => {
		const q = String(blogQueryValue || "").trim().toLowerCase();
		let base = (blogArticles || []).filter((a) => {
			if (blogStatusTab === "published" && !a?.isPublished) return false;
			if (blogStatusTab === "unpublished" && a?.isPublished) return false;
			if (Array.isArray(blogNamesSelected) && blogNamesSelected.length) {
				if (!blogNamesSelected.includes(String(a?.blogTitle || ""))) return false;
			}
			if (!q) return true;
			return [
				a?.title,
				a?.blogTitle,
				a?.seoTitle,
				a?.seoDescription
			].filter(Boolean).join(" ").toLowerCase().includes(q);
		});
		const selected = String(blogSeoStatus || "").split(",").map((s) => s.trim()).filter(Boolean);
		if (selected.length) base = base.filter((a) => {
			const tt = String(a?.seoTitle || "").trim();
			const dd = String(a?.seoDescription || "").trim();
			const st = tt && dd ? "filled" : tt || dd ? "partial" : "empty";
			return selected.includes(st);
		});
		return base;
	}, [
		blogArticles,
		blogQueryValue,
		blogSeoStatus,
		blogStatusTab,
		blogNamesSelected
	]);
	const blogPageSize = Math.max(1, Math.min(100, Number(searchParams.get("article_limit") || 25)));
	const blogPage = Math.max(1, Number(searchParams.get("article_page") || 1));
	const blogTotalPages = Math.max(1, Math.ceil((filteredBlogArticles?.length || 0) / blogPageSize));
	const pagedBlogArticles = useMemo(() => {
		const start = (blogPage - 1) * blogPageSize;
		return (filteredBlogArticles || []).slice(start, start + blogPageSize);
	}, [
		filteredBlogArticles,
		blogPage,
		blogPageSize
	]);
	const goBlogNextPage = useCallback(() => {
		if (blogPage >= blogTotalPages) return;
		const next = new URLSearchParams(searchParams);
		next.set("tab", "articles");
		next.set("article_page", String(blogPage + 1));
		setSearchParams(next);
	}, [
		blogPage,
		blogTotalPages,
		searchParams,
		setSearchParams
	]);
	const goBlogPrevPage = useCallback(() => {
		if (blogPage <= 1) return;
		const next = new URLSearchParams(searchParams);
		next.set("tab", "articles");
		next.set("article_page", String(blogPage - 1));
		setSearchParams(next);
	}, [
		blogPage,
		searchParams,
		setSearchParams
	]);
	const onBlogRowsPerPageChange = useCallback((value) => {
		const next = new URLSearchParams(searchParams);
		next.set("tab", "articles");
		next.set("article_limit", String(value || 25));
		next.set("article_page", "1");
		setSearchParams(next);
	}, [searchParams, setSearchParams]);
	const { selectedResources: selectedBlogIds, allResourcesSelected: allBlogSelected, handleSelectionChange: handleBlogSelectionChange } = useIndexResourceState(filteredBlogArticles, { resourceIDResolver: (a) => a.id });
	const lang = sanitizeLanguage(data.lang || "tr");
	const billing = data.billing || {
		isPro: false,
		planKey: "FREE",
		free: {
			used: 0,
			remaining: BILLING_PLANS.FREE.monthlyProductLimit,
			limit: BILLING_PLANS.FREE.monthlyProductLimit,
			month: ""
		}
	};
	const free = billing.free || {
		used: 0,
		remaining: BILLING_PLANS.FREE.monthlyProductLimit,
		limit: BILLING_PLANS.FREE.monthlyProductLimit,
		month: ""
	};
	const initialFilters = data.filters || {};
	const [productsFiltersMode, setProductsFiltersMode] = useState(IndexFiltersMode.Default);
	const [queryValue, setQueryValue] = useState(initialFilters.queryValue || "");
	const productsSearchInputRef = useRef(null);
	const blogSearchInputRef = useRef(null);
	useEffect(() => {
		const onKeyDown = (e) => {
			const key = String(e.key || "").toLowerCase();
			if ((e.ctrlKey || e.metaKey) && key === "f") {
				if (selectedTab === "products" && selectedResources.length > 0) return;
				e.preventDefault();
				if (selectedTab === "articles") setBlogFiltersMode(IndexFiltersMode.Filtering);
				else if (selectedTab === "products") setProductsFiltersMode(IndexFiltersMode.Filtering);
				return;
			}
			if (key === "escape") {
				if (productsFiltersMode === IndexFiltersMode.Filtering) setProductsFiltersMode(IndexFiltersMode.Default);
				if (blogFiltersMode === IndexFiltersMode.Filtering) setBlogFiltersMode(IndexFiltersMode.Default);
			}
		};
		window.addEventListener("keydown", onKeyDown, { capture: true });
		return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
	}, [
		selectedTab,
		selectedResources.length,
		productsFiltersMode,
		blogFiltersMode
	]);
	useEffect(() => {
		if (productsFiltersMode === IndexFiltersMode.Filtering) setTimeout(() => productsSearchInputRef.current?.focus?.(), 0);
	}, [productsFiltersMode]);
	useEffect(() => {
		if (blogFiltersMode === IndexFiltersMode.Filtering) setTimeout(() => blogSearchInputRef.current?.focus?.(), 0);
	}, [blogFiltersMode]);
	const [productVendorsSelected, setProductVendorsSelected] = useState(Array.isArray(initialFilters.productVendorsSelected) ? initialFilters.productVendorsSelected : []);
	const [productStatusSelected, setProductStatusSelected] = useState(typeof initialFilters.productStatusSelected === "string" ? initialFilters.productStatusSelected : "");
	const [productExtraFilters, setProductExtraFilters] = useState(Array.isArray(initialFilters.productExtraFilters) ? initialFilters.productExtraFilters : []);
	const [vendorPopoverActive, setVendorPopoverActive] = useState(false);
	const [tagPopoverActive, setTagPopoverActive] = useState(false);
	const [categoryPopoverActive, setCategoryPopoverActive] = useState(false);
	const [collectionPopoverActive, setCollectionPopoverActive] = useState(false);
	const [tagSearch, setTagSearch] = useState("");
	const [categorySearch, setCategorySearch] = useState("");
	const [collectionSearch, setCollectionSearch] = useState("");
	const [seoPopoverActive, setSeoPopoverActive] = useState(false);
	const [statusPopoverActive, setStatusPopoverActive] = useState(false);
	const [addFilterPopoverActive, setAddFilterPopoverActive] = useState(false);
	useMemo(() => [], [products]);
	const tagOptions = useMemo(() => {
		const s = /* @__PURE__ */ new Set();
		for (const p of products) for (const t of p?.tags || []) s.add(t);
		return Array.from(s).sort((a, b) => a.localeCompare(b));
	}, [products]);
	const categoryOptions = useMemo(() => {
		const s = /* @__PURE__ */ new Set();
		for (const p of products) if (p?.productType) s.add(p.productType);
		return Array.from(s).sort((a, b) => a.localeCompare(b));
	}, [products]);
	const collectionOptions = useMemo(() => {
		return (collections || []).map((c) => c.title).filter(Boolean).sort((a, b) => a.localeCompare(b));
	}, [collections]);
	const [statusTab, setStatusTab] = useState(initialFilters.statusTab || "all");
	const [tag, setTag] = useState(initialFilters.tag || "");
	const [category, setCategory] = useState(initialFilters.category || "");
	const [collection, setCollection] = useState(initialFilters.collection || "");
	const selectedTags = useMemo(() => String(tag || "").split(",").map((s) => s.trim()).filter(Boolean), [tag]);
	const selectedCategories = useMemo(() => String(category || "").split(",").map((s) => s.trim()).filter(Boolean), [category]);
	const selectedCollections = useMemo(() => String(collection || "").split(",").map((s) => s.trim()).filter(Boolean), [collection]);
	const [meta, setMeta] = useState(initialFilters.meta || "");
	const selectedSeoStatuses = useMemo(() => String(meta || "").split(",").map((s) => s.trim()).filter(Boolean), [meta]);
	const filteredProducts = useMemo(() => {
		const selected = selectedSeoStatuses;
		if (!selected.length) return products || [];
		return (products || []).filter((p) => {
			const seoTitle = String(p?.seo?.title || "").trim();
			const seoDesc = String(p?.seo?.description || "").trim();
			String(p?.description || "").trim();
			const st = seoTitle && seoDesc ? "filled" : seoTitle || seoDesc ? "partial" : "empty";
			return selected.includes(st);
		});
	}, [products, selectedSeoStatuses]);
	const [genTitle, setGenTitle] = useState(true);
	const [genDescription, setGenDescription] = useState(true);
	const [blogGenTitle, setBlogGenTitle] = useState(true);
	const [blogGenDescription, setBlogGenDescription] = useState(true);
	const [productsGenModalOpen, setProductsGenModalOpen] = useState(false);
	const [blogGenModalOpen, setBlogGenModalOpen] = useState(false);
	useEffect(() => {
		suppressUrlSyncRef.current = true;
		setQueryValue(initialFilters.queryValue || "");
		setStatusTab(initialFilters.statusTab || "all");
		setTag(initialFilters.tag || "");
		setCategory(initialFilters.category || "");
		setCollection(initialFilters.collection || "");
		setMeta(initialFilters.meta || "");
		setTimeout(() => {
			suppressUrlSyncRef.current = false;
		}, 0);
	}, [
		data.filters?.queryValue,
		data.filters?.statusTab,
		data.filters?.tag,
		data.filters?.category,
		data.filters?.collection,
		data.filters?.meta
	]);
	const setTabById = useCallback((tabId) => {
		const next = String(tabId || "");
		if (!next) return;
		const nextParams = new URLSearchParams(searchParams);
		nextParams.set("tab", next);
		setSearchParams(nextParams);
	}, [searchParams, setSearchParams]);
	useCallback(() => {
		const nextParams = new URLSearchParams(searchParams);
		nextParams.set("tab", selectedTab);
		nextParams.set("q", queryValue || "");
		nextParams.set("status", statusTab || "all");
		nextParams.set("tag", tag || "");
		nextParams.set("category", category || "");
		nextParams.set("collection", collection || "");
		nextParams.set("meta", meta || "");
		nextParams.delete("after");
		nextParams.delete("before");
		nextParams.set("page", "1");
		nextParams.set("lang", lang || "tr");
		setSearchParams(nextParams);
	}, [
		searchParams,
		setSearchParams,
		selectedTab,
		queryValue,
		statusTab,
		tag,
		category,
		collection,
		meta,
		lang
	]);
	const goProductsNextPage = useCallback(() => {
		const pageInfo = data?.productsPageInfo;
		if (!pageInfo?.endCursor) return;
		const nextParams = new URLSearchParams(searchParams);
		nextParams.set("tab", "products");
		nextParams.set("limit", String(data?.productsPageSize || 25));
		nextParams.set("after", pageInfo.endCursor);
		nextParams.delete("before");
		const curPage = Math.max(1, Number(searchParams.get("page") || 1));
		nextParams.set("page", String(curPage + 1));
		setSearchParams(nextParams);
	}, [
		data?.productsPageInfo,
		data?.productsPageSize,
		searchParams,
		setSearchParams
	]);
	const goProductsPrevPage = useCallback(() => {
		const pageInfo = data?.productsPageInfo;
		if (!pageInfo?.startCursor) return;
		const nextParams = new URLSearchParams(searchParams);
		nextParams.set("tab", "products");
		nextParams.set("limit", String(data?.productsPageSize || 25));
		nextParams.set("before", pageInfo.startCursor);
		nextParams.delete("after");
		const curPage = Math.max(1, Number(searchParams.get("page") || 1));
		nextParams.set("page", String(Math.max(1, curPage - 1)));
		setSearchParams(nextParams);
	}, [
		data?.productsPageInfo,
		data?.productsPageSize,
		searchParams,
		setSearchParams
	]);
	const onProductsRowsPerPageChange = useCallback((value) => {
		const nextParams = new URLSearchParams(searchParams);
		nextParams.set("tab", "products");
		nextParams.set("limit", String(value || 25));
		nextParams.delete("after");
		nextParams.delete("before");
		setSearchParams(nextParams);
	}, [searchParams, setSearchParams]);
	/**
	* Debounced URL sync (Products)
	* - Keeps search/filter state stable on refresh/back-forward
	* - Avoids loader refetch on every keystroke by debouncing updates
	*/
	useEffect(() => {
		if (suppressUrlSyncRef.current) return;
		if (selectedTab !== "products") return;
		if (productsUrlSyncTimerRef.current) clearTimeout(productsUrlSyncTimerRef.current);
		productsUrlSyncTimerRef.current = setTimeout(() => {
			const next = new URLSearchParams(searchParams);
			next.set("tab", "products");
			next.set("q", queryValue || "");
			next.set("status", statusTab || "all");
			next.set("tag", tag || "");
			next.set("category", category || "");
			next.set("collection", collection || "");
			next.set("meta", meta || "");
			const prevQ = searchParams.get("q") || "";
			const prevStatus = searchParams.get("status") || "all";
			const prevTag = searchParams.get("tag") || "";
			const prevCategory = searchParams.get("category") || "";
			const prevCollection = searchParams.get("collection") || "";
			const prevMeta = searchParams.get("meta") || "";
			const prevLimit = String(searchParams.get("limit") || 25);
			const nextLimit = String(data?.productsPageSize || Number(searchParams.get("limit") || 25));
			if (prevQ !== (queryValue || "") || prevStatus !== (statusTab || "all") || prevTag !== (tag || "") || prevCategory !== (category || "") || prevCollection !== (collection || "") || prevMeta !== (meta || "") || prevLimit !== nextLimit) {
				next.delete("after");
				next.delete("before");
				next.set("page", "1");
			}
			next.set("limit", nextLimit);
			next.set("lang", lang || "tr");
			setSearchParams(next, { replace: true });
		}, 350);
		return () => {
			if (productsUrlSyncTimerRef.current) clearTimeout(productsUrlSyncTimerRef.current);
		};
	}, [
		selectedTab,
		queryValue,
		statusTab,
		tag,
		category,
		collection,
		meta,
		lang,
		data?.productsPageSize,
		searchParams,
		setSearchParams
	]);
	/**
	* Debounced URL sync (Blog articles)
	* Blog list is client-filtered, but we keep filters in URL for persistence and back/forward.
	*/
	useEffect(() => {
		if (suppressUrlSyncRef.current) return;
		if (selectedTab !== "articles") return;
		if (blogUrlSyncTimerRef.current) clearTimeout(blogUrlSyncTimerRef.current);
		blogUrlSyncTimerRef.current = setTimeout(() => {
			const next = new URLSearchParams(searchParams);
			next.set("tab", "articles");
			next.set("article_q", blogQueryValue || "");
			next.set("article_status", blogStatusTab || "all");
			next.set("article_blog", Array.isArray(blogNamesSelected) ? blogNamesSelected.join(",") : "");
			next.set("article_meta", blogSeoStatus || "");
			next.set("article_limit", String(blogPageSize || 25));
			next.set("article_page", "1");
			next.set("lang", lang || "tr");
			setSearchParams(next, { replace: true });
		}, 350);
		return () => {
			if (blogUrlSyncTimerRef.current) clearTimeout(blogUrlSyncTimerRef.current);
		};
	}, [
		selectedTab,
		blogQueryValue,
		blogStatusTab,
		blogNamesSelected,
		blogSeoStatus,
		blogPageSize,
		lang,
		searchParams,
		setSearchParams
	]);
	const clearAllFilters = useCallback(() => {
		setQueryValue("");
		setTag("");
		setCategory("");
		setCollection("");
		setMeta("");
	}, []);
	const selectedCount = selectedResources.length;
	const hasSelection = selectedCount > 0;
	const selectedImageCount = selectedImageResources.length;
	const hasImageSelection = selectedImageCount > 0;
	const freeRemaining = Number(free.remaining ?? BILLING_PLANS.FREE.monthlyProductLimit);
	const exceedsFreeLimit = !billing.isPro && selectedCount > 0 && selectedCount > freeRemaining;
	const billingUrl = useMemo(() => {
		return `/app/billing?${new URLSearchParams(location.search || "").toString()}`;
	}, [location.search]);
	const genError = startGenFetcher.data?.ok === false ? startGenFetcher.data : null;
	const bulkGenerate = useCallback(() => {
		if (!genTitle && !genDescription) return;
		if (exceedsFreeLimit) return;
		const selected = (products || []).filter((p) => (selectedResources || []).includes(p.id));
		const ids = selected.map((p) => String(p.id));
		const titlesById = {};
		for (const p of selected) titlesById[String(p.id)] = p.title || "";
		const settings = {
			fields: {
				metaTitle: genTitle,
				metaDescription: genDescription
			},
			productFilter: queryValue,
			filters: {
				statusTab,
				tag,
				category,
				collection,
				meta
			},
			tab: "products"
		};
		startGenFetcher.submit({
			intent: "start_generate",
			productIds: JSON.stringify(ids),
			language: lang,
			metaTitle: String(genTitle),
			metaDescription: String(genDescription),
			settingsJson: JSON.stringify(settings),
			titlesByIdJson: JSON.stringify(titlesById)
		}, { method: "post" });
	}, [
		genTitle,
		genDescription,
		products,
		selectedResources,
		startGenFetcher,
		queryValue,
		statusTab,
		tag,
		category,
		collection,
		meta,
		lang,
		exceedsFreeLimit
	]);
	const bulkGenerateBlog = useCallback(() => {
		if (!billing.isPro) return;
		if (!blogGenTitle && !blogGenDescription) return;
		const titlesById = Object.fromEntries((blogArticles || []).map((a) => [a.id, a.title]));
		startGenFetcher.submit({
			intent: "start_generate_blog",
			articleIds: JSON.stringify(selectedBlogIds),
			titlesJson: JSON.stringify(titlesById),
			language: lang,
			settingsJson: JSON.stringify(data.settings || {}),
			genTitle: blogGenTitle ? "1" : "0",
			genDescription: blogGenDescription ? "1" : "0"
		}, { method: "post" });
	}, [
		billing.isPro,
		blogGenTitle,
		blogGenDescription,
		blogArticles,
		selectedBlogIds,
		startGenFetcher,
		lang,
		data.settings
	]);
	const productsPromotedBulkActions = useMemo(() => {
		return [{
			content: "Generate",
			onAction: () => setProductsGenModalOpen(true),
			disabled: !hasSelection || !genTitle && !genDescription || exceedsFreeLimit || !billing.isPro && freeRemaining <= 0
		}];
	}, [
		hasSelection,
		genTitle,
		genDescription,
		exceedsFreeLimit,
		billing.isPro,
		freeRemaining
	]);
	const blogHasSelection = selectedBlogIds.length > 0;
	const blogPromotedBulkActions = useMemo(() => {
		return [{
			content: "Generate",
			onAction: () => setBlogGenModalOpen(true),
			disabled: !billing.isPro || !blogHasSelection || !blogGenTitle && !blogGenDescription
		}];
	}, [
		billing.isPro,
		blogHasSelection,
		blogGenTitle,
		blogGenDescription
	]);
	const bulkGenerateImages = useCallback(() => {
		if (!billing.isPro) return;
		if (!selectedImageResources || selectedImageResources.length === 0) return;
		const selectedSet = new Set(selectedImageResources.map(String));
		const selected = (filteredImageRows || []).filter((r) => selectedSet.has(String(r.mediaId))).map((r) => ({
			productId: r.productId,
			productTitle: r.productTitle || "",
			mediaId: r.mediaId,
			imageUrl: r.url || "",
			currentAltText: r.altText || ""
		}));
		startGenFetcher.submit({
			intent: "start_generate_images",
			imagesJson: JSON.stringify(selected),
			language: lang,
			settingsJson: JSON.stringify({ tab: "images" })
		}, { method: "post" });
	}, [
		billing.isPro,
		selectedImageResources,
		filteredImageRows,
		startGenFetcher,
		lang
	]);
	const statusTabs = useMemo(() => [
		{
			key: "all",
			label: "All"
		},
		{
			key: "active",
			label: "Active"
		},
		{
			key: "draft",
			label: "Draft"
		},
		{
			key: "archived",
			label: "Archived"
		}
	], []);
	const rowsPerPageOptions = useMemo(() => [
		{
			label: "25",
			value: "25"
		},
		{
			label: "50",
			value: "50"
		},
		{
			label: "100",
			value: "100"
		}
	], []);
	useMemo(() => {
		return [
			{
				key: "tag",
				label: "Tag",
				filter: /* @__PURE__ */ jsx(TextField, {
					label: "Tag",
					value: tag,
					onChange: setTag,
					autoComplete: "off",
					placeholder: "e.g. winter"
				}),
				shortcut: true
			},
			{
				key: "category",
				label: "Category",
				filter: /* @__PURE__ */ jsx(TextField, {
					label: "Category",
					value: category,
					onChange: setCategory,
					autoComplete: "off",
					placeholder: "e.g. Snowboard"
				}),
				shortcut: true
			},
			{
				key: "collection",
				label: "Collection",
				filter: /* @__PURE__ */ jsx(TextField, {
					label: "Collection",
					value: collection,
					onChange: setCollection,
					autoComplete: "off",
					placeholder: "e.g. Winter"
				}),
				shortcut: true
			},
			{
				key: "meta",
				label: "SEO status",
				filter: /* @__PURE__ */ jsx(ChoiceList, {
					title: "SEO status",
					choices: [
						{
							label: "Filled",
							value: "filled"
						},
						{
							label: "Partial",
							value: "partial"
						},
						{
							label: "Empty",
							value: "empty"
						}
					],
					selected: meta ? String(meta).split(",").filter(Boolean) : [],
					allowMultiple: true,
					onChange: (values) => setMeta(Array.isArray(values) ? values.join(",") : "")
				}),
				shortcut: true
			}
		];
	}, [
		tag,
		category,
		collection,
		meta
	]);
	useMemo(() => {
		const out = [];
		const fmtMulti = (label, valuesRaw) => {
			const values = String(valuesRaw || "").split(",").map((s) => s.trim()).filter(Boolean);
			if (!values.length) return null;
			if (values.length === 1) return `${label}: ${values[0]}`;
			return `${label}: ${values.slice(0, 2).join(", ")}${values.length > 2 ? ` +${values.length - 2}` : ""}`;
		};
		const tagLabel = fmtMulti("Tag", tag);
		if (tagLabel) out.push({
			key: "tag",
			label: tagLabel,
			onRemove: () => setTag("")
		});
		const catLabel = fmtMulti("Category", category);
		if (catLabel) out.push({
			key: "category",
			label: catLabel,
			onRemove: () => setCategory("")
		});
		const colLabel = fmtMulti("Collection", collection);
		if (colLabel) out.push({
			key: "collection",
			label: colLabel,
			onRemove: () => setCollection("")
		});
		if (meta) {
			const metaValues = String(meta).split(",").map((s) => s.trim()).filter(Boolean).map((v) => v === "filled" ? "Filled" : v === "partial" ? "Partial" : v === "empty" ? "Empty" : v);
			const metaLabel = metaValues.length === 1 ? `SEO status: ${metaValues[0]}` : `SEO status: ${metaValues.slice(0, 2).join(", ")}${metaValues.length > 2 ? ` +${metaValues.length - 2}` : ""}`;
			out.push({
				key: "meta",
				label: metaLabel,
				onRemove: () => setMeta("")
			});
		}
		return out;
	}, [
		tag,
		category,
		collection,
		meta
	]);
	const blogTabs = useMemo(() => [
		{
			id: "all",
			content: "All"
		},
		{
			id: "published",
			content: "Published"
		},
		{
			id: "unpublished",
			content: "Draft"
		}
	], []);
	const blogFilters = useMemo(() => {
		return [{
			key: "blog",
			label: "Blog",
			filter: /* @__PURE__ */ jsx(ChoiceList, {
				title: "Blog",
				choices: blogNameChoices.map((c) => ({
					label: c.label,
					value: c.value
				})),
				selected: blogNamesSelected,
				allowMultiple: true,
				onChange: setBlogNamesSelected
			}),
			shortcut: true
		}, {
			key: "blogSeoStatus",
			label: "SEO status",
			filter: /* @__PURE__ */ jsx(ChoiceList, {
				title: "SEO status",
				choices: [
					{
						label: "Filled",
						value: "filled"
					},
					{
						label: "Partial",
						value: "partial"
					},
					{
						label: "Empty",
						value: "empty"
					}
				],
				selected: blogSeoStatus ? String(blogSeoStatus).split(",").filter(Boolean) : [],
				allowMultiple: true,
				onChange: (values) => setBlogSeoStatus(values.join(","))
			}),
			shortcut: true
		}];
	}, [
		blogNameChoices,
		blogNamesSelected,
		blogSeoStatus
	]);
	const blogAppliedFilters = useMemo(() => {
		const out = [];
		if (Array.isArray(blogNamesSelected) && blogNamesSelected.length) {
			const preview = blogNamesSelected.slice(0, 2).join(", ");
			out.push({
				key: "blogNames",
				label: `Blog: ${preview}${blogNamesSelected.length > 2 ? ` +${blogNamesSelected.length - 2}` : ""}`,
				onRemove: () => setBlogNamesSelected([])
			});
		}
		if (blogSeoStatus) {
			const labels = String(blogSeoStatus).split(",").map((s) => s.trim()).filter(Boolean).map((v) => v === "filled" ? "Filled" : v === "partial" ? "Partial" : v === "empty" ? "Empty" : v);
			const preview = labels.slice(0, 2).join(", ");
			out.push({
				key: "blogSeoStatus",
				label: `SEO status: ${preview}${labels.length > 2 ? ` +${labels.length - 2}` : ""}`,
				onRemove: () => setBlogSeoStatus("")
			});
		}
		return out;
	}, [blogNamesSelected, blogSeoStatus]);
	const onStatusTabClick = useCallback((key) => {
		setStatusTab(key);
		const nextParams = new URLSearchParams(searchParams);
		nextParams.set("status", key);
		nextParams.set("tab", selectedTab);
		setSearchParams(nextParams);
	}, [
		searchParams,
		setSearchParams,
		selectedTab
	]);
	const onBlogStatusTabClick = useCallback((key) => {
		setBlogStatusTab(key);
		const nextParams = new URLSearchParams(searchParams);
		nextParams.set("article_status", key);
		nextParams.set("tab", selectedTab);
		setSearchParams(nextParams);
	}, [
		searchParams,
		setSearchParams,
		selectedTab
	]);
	const rowMarkup = filteredProducts.map((p, index) => {
		const adminUrl = productAdminUrl({
			shopDomain,
			productGid: p.id
		});
		const imageUrl = p.featuredImage?.url || "";
		const imageAlt = p.featuredImage?.altText || p.title || "Product image";
		const norm = normalizeStatus(p.status);
		const label = statusLabelTr(norm);
		const tone = statusTone(norm);
		const seoTitle = String(p?.seo?.title || "").trim();
		const seoDesc = String(p?.seo?.description || "").trim();
		const productDesc = String(p?.description || "").trim();
		const seoStatus = seoTitle && seoDesc ? "filled" : seoTitle || seoDesc ? "partial" : "empty";
		const seoLabel = seoStatus === "filled" ? "Filled" : seoStatus === "partial" ? "Missing" : "Empty";
		const seoTone = seoStatus === "filled" ? "success" : seoStatus === "partial" ? "warning" : "subdued";
		return /* @__PURE__ */ jsxs(IndexTable.Row, {
			id: p.id,
			position: index,
			selected: selectedResources.includes(p.id),
			children: [
				/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsxs(InlineStack, {
					gap: "300",
					blockAlign: "center",
					wrap: false,
					children: [/* @__PURE__ */ jsx(Thumbnail, {
						source: imageUrl || void 0,
						alt: imageAlt,
						size: "small"
					}), /* @__PURE__ */ jsxs(BlockStack, {
						gap: "050",
						children: [adminUrl ? /* @__PURE__ */ jsx("a", {
							href: adminUrl,
							target: "_blank",
							rel: "noreferrer",
							style: { textDecoration: "none" },
							children: /* @__PURE__ */ jsx(Text, {
								as: "span",
								variant: "bodyMd",
								fontWeight: "semibold",
								tone: "link",
								children: p.title
							})
						}) : /* @__PURE__ */ jsx(Text, {
							as: "span",
							variant: "bodyMd",
							fontWeight: "semibold",
							children: p.title
						}), productDesc ? /* @__PURE__ */ jsx("div", {
							style: {
								maxWidth: 420,
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap"
							},
							children: /* @__PURE__ */ jsx(Text, {
								as: "span",
								variant: "bodySm",
								tone: "subdued",
								children: productDesc
							})
						}) : null]
					})]
				}) }),
				/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Badge, {
					tone,
					children: label
				}) }),
				/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Badge, {
					tone: seoTone,
					children: seoLabel
				}) }),
				/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx("div", {
					style: {
						maxWidth: 280,
						display: "-webkit-box",
						WebkitBoxOrient: "vertical",
						WebkitLineClamp: 3,
						overflow: "hidden",
						whiteSpace: "normal",
						wordBreak: "break-word"
					},
					children: /* @__PURE__ */ jsx(Text, {
						as: "span",
						variant: "bodySm",
						tone: seoTitle ? void 0 : "subdued",
						children: seoTitle ? seoTitle : "—"
					})
				}) }),
				/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx("div", {
					style: {
						maxWidth: 340,
						display: "-webkit-box",
						WebkitBoxOrient: "vertical",
						WebkitLineClamp: 3,
						overflow: "hidden",
						whiteSpace: "normal",
						wordBreak: "break-word"
					},
					children: /* @__PURE__ */ jsx(Text, {
						as: "span",
						variant: "bodySm",
						tone: seoDesc ? void 0 : "subdued",
						children: seoDesc ? seoDesc : "—"
					})
				}) })
			]
		}, p.id);
	});
	return /* @__PURE__ */ jsx(Page, {
		title: "SEO Tools",
		fullWidth: true,
		children: /* @__PURE__ */ jsxs(BlockStack, {
			gap: "400",
			children: [
				/* @__PURE__ */ jsx(InlineStack, {
					align: "end",
					children: /* @__PURE__ */ jsx(InlineStack, {
						gap: "100",
						children: tabs.map((t) => /* @__PURE__ */ jsx(Button, {
							variant: "tertiary",
							pressed: selectedTab === t.id,
							onClick: () => setTabById(t.id),
							children: t.content
						}, t.id))
					})
				}),
				genError ? /* @__PURE__ */ jsx(Banner, {
					tone: "critical",
					title: "Generate failed",
					children: /* @__PURE__ */ jsx(Text, {
						as: "p",
						variant: "bodyMd",
						children: genError.code === "FREE_LIMIT_EXCEEDED" ? `Free plan limit exceeded. Remaining this month: ${genError.billing?.free?.remaining ?? free.remaining}.` : genError.error || "Unknown error"
					})
				}) : null,
				exceedsFreeLimit ? /* @__PURE__ */ jsx(Banner, {
					tone: "warning",
					title: "Selection exceeds your free plan limit",
					children: /* @__PURE__ */ jsxs(Text, {
						as: "p",
						variant: "bodyMd",
						children: [
							"You selected ",
							selectedCount,
							" products but you only have ",
							freeRemaining,
							" remaining this month. Reduce selection or upgrade."
						]
					})
				}) : null,
				/* @__PURE__ */ jsx("style", { children: `
        .seoToolsProductsTable :is(.Polaris-IndexTable__BulkActions, .Polaris-IndexTable__BulkActionsWrapper, [class*="IndexTable__BulkActions"]) {
          background: var(--p-color-bg-surface-secondary) !important;
        }
        .seoToolsBlogTable :is(.Polaris-IndexTable__BulkActions, .Polaris-IndexTable__BulkActionsWrapper, [class*="IndexTable__BulkActions"]) {
          background: var(--p-color-bg-surface-secondary) !important;
        }

        /* Our pages already render the status tabs row. When using IndexFilters for the search panel,
           hide its internal tabs row (otherwise it can render a blank/duplicate bar in some Polaris versions). */
        .seoToolsFiltersPanel :is(.Polaris-IndexFilters__TabsWrapper, .Polaris-IndexFilters__Tabs, [class*="IndexFilters__Tabs"]) {
          display: none !important;
        }

        /* Shopify-like compact Search/Filter activator (used on the right side of status tabs row)
           We mimic Shopify Admin's small pill: no outer box, subtle background, divider between icons. */
        .seoToolsSearchButton {
          border-radius: 999px;
        }
        .seoToolsSearchButton:focus-visible {
          outline: none;
        }
        .seoToolsSearchActivator {
          display: inline-flex;
          align-items: center;
          padding: 4px 6px;
          border-radius: 999px;
          border: 1px solid var(--p-color-border);
          background: var(--p-color-bg-surface-secondary);
          box-shadow: none;
        }
        .seoToolsSearchActivator:hover {
          background: var(--p-color-bg-surface-secondary-hover);
        }
        .seoToolsSearchActivator:active {
          background: var(--p-color-bg-surface-secondary-active);
        }
        .seoToolsSearchActivatorPart {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 6px;
        }
        .seoToolsSearchActivatorPart + .seoToolsSearchActivatorPart {
          border-left: 1px solid var(--p-color-border);
        }
      ` }),
				/* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(BlockStack, {
					gap: "400",
					children: selectedTab === "products" ? /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsxs(InlineStack, {
							align: "space-between",
							blockAlign: "center",
							children: [/* @__PURE__ */ jsx(ButtonGroup, { children: statusTabs.map((t) => /* @__PURE__ */ jsx(Button, {
								variant: "tertiary",
								pressed: statusTab === t.key,
								onClick: () => onStatusTabClick(t.key),
								children: t.label
							}, t.key)) }), /* @__PURE__ */ jsxs(ButtonGroup, {
								segmented: true,
								children: [/* @__PURE__ */ jsx(Button, {
									icon: SvgSearchIcon,
									accessibilityLabel: "Search",
									onClick: () => {
										setProductsFiltersMode(IndexFiltersMode.Filtering);
										requestAnimationFrame(() => productsSearchInputRef.current?.focus?.());
									}
								}), /* @__PURE__ */ jsx(Button, {
									icon: SvgFilterIcon,
									accessibilityLabel: "Filters",
									onClick: () => setProductsFiltersMode(IndexFiltersMode.Filtering)
								})]
							})]
						}),
						selectedTab === "products" && productsFiltersMode === IndexFiltersMode.Filtering ? /* @__PURE__ */ jsx("div", {
							className: "seoToolsFiltersPanel",
							children: /* @__PURE__ */ jsx(IndexFilters, {
								tabs: [],
								selected: 0,
								onSelect: () => {},
								mode: productsFiltersMode,
								setMode: setProductsFiltersMode,
								queryValue,
								queryPlaceholder: "Search across all products",
								onQueryChange: (value) => setQueryValue(value),
								onQueryClear: () => setQueryValue(""),
								queryField: /* @__PURE__ */ jsx(TextField, {
									value: queryValue,
									onChange: setQueryValue,
									placeholder: "Search across all products",
									prefix: /* @__PURE__ */ jsx(Icon, { source: SvgSearchIcon }),
									autoComplete: "off",
									inputRef: productsSearchInputRef
								}),
								filters: [
									{
										key: "tag",
										label: "Tag",
										filter: /* @__PURE__ */ jsx(ChoiceList, {
											title: "Tag",
											allowMultiple: true,
											choices: tagOptions.map((t) => ({
												label: t,
												value: t
											})),
											selected: selectedTags,
											onChange: (sel) => setTag((sel || []).join(","))
										}),
										shortcut: true
									},
									{
										key: "category",
										label: "Category",
										filter: /* @__PURE__ */ jsx(ChoiceList, {
											title: "Category",
											allowMultiple: true,
											choices: categoryOptions.map((t) => ({
												label: t,
												value: t
											})),
											selected: selectedCategories,
											onChange: (sel) => setCategory((sel || []).join(","))
										})
									},
									{
										key: "collection",
										label: "Collection",
										filter: /* @__PURE__ */ jsx(ChoiceList, {
											title: "Collection",
											allowMultiple: true,
											choices: collectionOptions.map((t) => ({
												label: t,
												value: t
											})),
											selected: selectedCollections,
											onChange: (sel) => setCollection((sel || []).join(","))
										})
									},
									{
										key: "meta",
										label: "SEO status",
										filter: /* @__PURE__ */ jsx(ChoiceList, {
											title: "SEO status",
											allowMultiple: true,
											choices: [
												{
													label: "Filled",
													value: "filled"
												},
												{
													label: "Missing",
													value: "partial"
												},
												{
													label: "Empty",
													value: "empty"
												}
											],
											selected: selectedSeoStatuses,
											onChange: (sel) => setMeta((sel || []).join(","))
										})
									}
								],
								appliedFilters: [
									...selectedTags.length ? [{
										key: "tag",
										label: `Tag: ${selectedTags.join(", ")}`,
										onRemove: () => setTag("")
									}] : [],
									...selectedCategories.length ? [{
										key: "category",
										label: `Category: ${selectedCategories.join(", ")}`,
										onRemove: () => setCategory("")
									}] : [],
									...selectedCollections.length ? [{
										key: "collection",
										label: `Collection: ${selectedCollections.join(", ")}`,
										onRemove: () => setCollection("")
									}] : [],
									...selectedSeoStatuses.length ? [{
										key: "meta",
										label: `SEO status: ${selectedSeoStatuses.map((s) => s === "filled" ? "Filled" : s === "partial" ? "Missing" : "Empty").join(", ")}`,
										onRemove: () => setMeta("")
									}] : []
								],
								onClearAll: () => {
									clearAllFilters();
									setProductsFiltersMode(IndexFiltersMode.Default);
								},
								cancelAction: {
									onAction: () => setProductsFiltersMode(IndexFiltersMode.Default),
									disabled: false,
									loading: false
								}
							})
						}) : null,
						/* @__PURE__ */ jsx(Modal, {
							open: productsGenModalOpen,
							onClose: () => setProductsGenModalOpen(false),
							title: "Generate",
							primaryAction: {
								content: "Generate",
								onAction: () => {
									setProductsGenModalOpen(false);
									bulkGenerate();
								},
								disabled: !genTitle && !genDescription || exceedsFreeLimit || !billing.isPro && freeRemaining <= 0,
								loading: startGenFetcher.state === "submitting"
							},
							secondaryActions: [{
								content: "Cancel",
								onAction: () => setProductsGenModalOpen(false)
							}],
							children: /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsxs(BlockStack, {
								gap: "300",
								children: [/* @__PURE__ */ jsx(Text, {
									as: "p",
									variant: "bodyMd",
									children: "Which fields should be generated for the selected products?"
								}), /* @__PURE__ */ jsxs(InlineStack, {
									gap: "400",
									children: [/* @__PURE__ */ jsx(Checkbox$1, {
										label: "Title",
										checked: genTitle,
										onChange: setGenTitle
									}), /* @__PURE__ */ jsx(Checkbox$1, {
										label: "Description",
										checked: genDescription,
										onChange: setGenDescription
									})]
								})]
							}) })
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "seoToolsProductsTable",
							style: {
								marginLeft: "calc(var(--p-space-400) * -1)",
								marginRight: "calc(var(--p-space-400) * -1)"
							},
							children: [/* @__PURE__ */ jsx(IndexTable, {
								resourceName: {
									singular: "product",
									plural: "products"
								},
								itemCount: filteredProducts.length,
								selectable: true,
								selectedItemsCount: allResourcesSelected ? "All" : selectedResources.length,
								onSelectionChange: handleSelectionChange,
								promotedBulkActions: productsPromotedBulkActions,
								headings: [
									{ title: "Product" },
									{ title: "Status" },
									{ title: "SEO status" },
									{ title: "Meta title" },
									{ title: "Meta description" }
								],
								children: rowMarkup
							}), data?.productsPageInfo ? /* @__PURE__ */ jsx("div", {
								style: { padding: "var(--p-space-300) var(--p-space-400)" },
								children: /* @__PURE__ */ jsxs(InlineStack, {
									align: "space-between",
									blockAlign: "center",
									gap: "400",
									children: [/* @__PURE__ */ jsx(Text, {
										as: "span",
										variant: "bodySm",
										tone: "subdued",
										children: (() => {
											const total = Number(data?.productsTotalCount || 0);
											const limit = Number(data?.productsPageSize || 25);
											const page = Math.max(1, Number(searchParams.get("page") || 1));
											return `${total === 0 ? 0 : (page - 1) * limit + 1}–${total === 0 ? 0 : Math.min(page * limit, total)} / ${total}`;
										})()
									}), /* @__PURE__ */ jsxs(InlineStack, {
										gap: "300",
										blockAlign: "center",
										children: [/* @__PURE__ */ jsxs(InlineStack, {
											gap: "200",
											blockAlign: "center",
											children: [/* @__PURE__ */ jsx(Text, {
												as: "span",
												variant: "bodySm",
												tone: "subdued",
												children: "Rows"
											}), /* @__PURE__ */ jsx("div", {
												style: { width: 96 },
												children: /* @__PURE__ */ jsx(Select, {
													label: "Rows per page",
													labelHidden: true,
													options: rowsPerPageOptions,
													value: String(data?.productsPageSize || 25),
													onChange: onProductsRowsPerPageChange
												})
											})]
										}), /* @__PURE__ */ jsx(Pagination, {
											hasPrevious: Boolean(data.productsPageInfo?.hasPreviousPage),
											onPrevious: goProductsPrevPage,
											hasNext: Boolean(data.productsPageInfo?.hasNextPage),
											onNext: goProductsNextPage
										})]
									})]
								})
							}) : null]
						}),
						/* @__PURE__ */ jsx(Text, {
							as: "p",
							variant: "bodySm",
							tone: "subdued",
							children: "Generate creates a job for the selected products and redirects to Generation History."
						})
					] }) : selectedTab === "images" ? /* @__PURE__ */ jsxs(BlockStack, {
						gap: "300",
						children: [
							/* @__PURE__ */ jsxs(InlineStack, {
								align: "space-between",
								blockAlign: "center",
								children: [/* @__PURE__ */ jsx(ButtonGroup, { children: imageTabs.map((t) => /* @__PURE__ */ jsx(Button, {
									variant: "tertiary",
									pressed: imageAltTab === t.id,
									onClick: () => onImageAltTabClick(t.id),
									children: t.content
								}, t.id)) }), /* @__PURE__ */ jsxs(ButtonGroup, {
									segmented: true,
									children: [/* @__PURE__ */ jsx(Button, {
										icon: SvgSearchIcon,
										accessibilityLabel: "Search",
										onClick: () => {
											setImageFiltersMode(IndexFiltersMode.Filtering);
											requestAnimationFrame(() => imageSearchInputRef.current?.focus?.());
										}
									}), /* @__PURE__ */ jsx(Button, {
										icon: SvgFilterIcon,
										accessibilityLabel: "Filters",
										onClick: () => setImageFiltersMode(IndexFiltersMode.Filtering)
									})]
								})]
							}),
							imageFiltersMode === IndexFiltersMode.Filtering ? /* @__PURE__ */ jsx("div", {
								className: "seoToolsFiltersPanel",
								children: /* @__PURE__ */ jsx(IndexFilters, {
									tabs: [],
									selected: 0,
									onSelect: () => {},
									queryValue: imageQueryValue,
									queryPlaceholder: "Search by product name",
									onQueryChange: onImageQueryChange,
									onQueryClear: () => onImageQueryChange(""),
									queryField: /* @__PURE__ */ jsx(TextField, {
										value: imageQueryValue,
										onChange: onImageQueryChange,
										placeholder: "Search by product name",
										prefix: /* @__PURE__ */ jsx(Icon, { source: SvgSearchIcon }),
										autoComplete: "off",
										inputRef: imageSearchInputRef
									}),
									filters: imageFilters,
									appliedFilters: imageAppliedFilters,
									onClearAll: () => {
										onImageQueryChange("");
										onImageStatusChange([]);
										setImageFiltersMode(IndexFiltersMode.Default);
									},
									cancelAction: {
										content: "Cancel",
										onAction: () => setImageFiltersMode(IndexFiltersMode.Default),
										disabled: false,
										loading: false
									},
									mode: imageFiltersMode,
									setMode: setImageFiltersMode
								})
							}) : null,
							/* @__PURE__ */ jsxs(InlineStack, {
								align: "space-between",
								blockAlign: "center",
								children: [/* @__PURE__ */ jsx(Text, {
									as: "span",
									variant: "bodyMd",
									fontWeight: "semibold",
									children: hasImageSelection ? `${selectedImageCount} image(s) selected` : "Select images to generate ALT text"
								}), /* @__PURE__ */ jsx(Button, {
									variant: "primary",
									onClick: bulkGenerateImages,
									disabled: !billing.isPro || !hasImageSelection,
									loading: startGenFetcher.state === "submitting",
									children: "Generate ALT text"
								})]
							}),
							!billing.isPro ? /* @__PURE__ */ jsx(Banner, {
								tone: "info",
								title: "Pro feature",
								action: {
									content: "Upgrade to Pro",
									url: billingUrl
								},
								children: /* @__PURE__ */ jsx(Text, {
									as: "p",
									variant: "bodyMd",
									children: "Image ALT text generation is available on the Pro plan."
								})
							}) : null,
							filteredImageRows.length === 0 ? /* @__PURE__ */ jsx(Banner, {
								tone: "warning",
								title: "No images found",
								children: /* @__PURE__ */ jsx(Text, {
									as: "p",
									variant: "bodyMd",
									children: "Try adjusting filters/search. Only MediaImage items are shown."
								})
							}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Modal, {
								open: isImagePreviewOpen,
								onClose: closeImagePreview,
								title: imagePreviewRow?.productTitle ? `Image preview — ${imagePreviewRow.productTitle}` : "Image preview",
								primaryAction: {
									content: "Save alt text",
									onAction: () => {
										if (!imagePreviewRow?.mediaId || !imagePreviewRow?.productId) return;
										const fd = new FormData();
										fd.set("intent", "update_image_alt");
										fd.set("productId", String(imagePreviewRow.productId));
										fd.set("mediaId", String(imagePreviewRow.mediaId));
										fd.set("altText", String(imageAltDraft || ""));
										updateAltFetcher.submit(fd, { method: "post" });
									},
									loading: updateAltFetcher.state === "submitting",
									disabled: !imagePreviewRow?.mediaId || !imagePreviewRow?.productId
								},
								secondaryActions: [{
									content: "Close",
									onAction: closeImagePreview
								}],
								children: /* @__PURE__ */ jsx(Modal.Section, { children: imagePreviewRow ? /* @__PURE__ */ jsxs(BlockStack, {
									gap: "300",
									children: [
										imageAltSaveError ? /* @__PURE__ */ jsx(Banner, {
											tone: "critical",
											title: "Could not save alt text",
											children: /* @__PURE__ */ jsx(Text, {
												as: "p",
												variant: "bodyMd",
												children: String(imageAltSaveError)
											})
										}) : null,
										/* @__PURE__ */ jsx(Box, { children: /* @__PURE__ */ jsx("img", {
											src: imagePreviewRow.url,
											alt: String(imageAltDraft || imagePreviewRow.productTitle || ""),
											style: {
												width: "100%",
												maxHeight: 420,
												objectFit: "contain",
												borderRadius: 8,
												display: "block"
											}
										}) }),
										/* @__PURE__ */ jsxs(BlockStack, {
											gap: "100",
											children: [/* @__PURE__ */ jsx(Text, {
												as: "p",
												variant: "bodyMd",
												fontWeight: "semibold",
												children: "ALT text"
											}), /* @__PURE__ */ jsx(TextField, {
												value: imageAltDraft,
												onChange: (v) => {
													setImageAltDraft(v);
													if (imageAltSaveError) setImageAltSaveError(null);
												},
												placeholder: "(empty)",
												multiline: 3,
												autoComplete: "off"
											})]
										}),
										/* @__PURE__ */ jsxs(BlockStack, {
											gap: "100",
											children: [/* @__PURE__ */ jsx(Text, {
												as: "p",
												variant: "bodyMd",
												fontWeight: "semibold",
												children: "Media ID"
											}), /* @__PURE__ */ jsx(Text, {
												as: "p",
												variant: "bodySm",
												tone: "subdued",
												children: imagePreviewRow.mediaId
											})]
										})
									]
								}) : null })
							}), /* @__PURE__ */ jsx(Card, {
								padding: "0",
								children: /* @__PURE__ */ jsx(IndexTable, {
									resourceName: {
										singular: "image",
										plural: "images"
									},
									itemCount: filteredImageRows.length,
									selectedItemsCount: allImagesSelected ? "All" : selectedImageResources.length,
									onSelectionChange: handleImageSelectionChange,
									headings: [
										{ title: "Image" },
										{ title: "Product" },
										{ title: "Status" },
										{ title: "ALT text" },
										{ title: "Actions" }
									],
									children: filteredImageRows.map((r, index) => /* @__PURE__ */ jsxs(IndexTable.Row, {
										id: r.mediaId,
										position: index,
										selected: selectedImageResources.includes(r.mediaId),
										children: [
											/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Thumbnail, {
												source: r.url,
												alt: r.altTextEffective || r.productTitle
											}) }),
											/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsxs(BlockStack, {
												gap: "050",
												children: [/* @__PURE__ */ jsx(Text, {
													as: "span",
													variant: "bodyMd",
													fontWeight: "semibold",
													children: r.productTitle
												}), /* @__PURE__ */ jsx(Text, {
													as: "span",
													variant: "bodySm",
													tone: "subdued",
													children: r.mediaId
												})]
											}) }),
											/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Badge, {
												tone: statusTone(r.productStatus),
												children: statusLabelTr(r.productStatus)
											}) }),
											/* @__PURE__ */ jsx(IndexTable.Cell, { children: r.altTextEffective ? /* @__PURE__ */ jsx(Text, {
												as: "span",
												variant: "bodySm",
												children: truncate(r.altTextEffective, 90)
											}) : /* @__PURE__ */ jsxs(InlineStack, {
												gap: "200",
												blockAlign: "center",
												children: [/* @__PURE__ */ jsx(Badge, {
													tone: "warning",
													children: "Empty"
												}), /* @__PURE__ */ jsx(Text, {
													as: "span",
													variant: "bodySm",
													tone: "subdued",
													children: "(empty)"
												})]
											}) }),
											/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Button, {
												variant: "tertiary",
												onClick: () => openImagePreview(r),
												disabled: !billing.isPro,
												children: "Preview"
											}) })
										]
									}, r.mediaId))
								})
							})] })
						]
					}) : /* @__PURE__ */ jsxs(BlockStack, {
						gap: "300",
						children: [
							/* @__PURE__ */ jsxs(InlineStack, {
								align: "space-between",
								blockAlign: "center",
								children: [/* @__PURE__ */ jsx(ButtonGroup, { children: blogTabs.map((t) => /* @__PURE__ */ jsx(Button, {
									variant: "tertiary",
									pressed: blogStatusTab === t.id,
									onClick: () => onBlogStatusTabClick(t.id),
									children: t.content
								}, t.id)) }), /* @__PURE__ */ jsxs(ButtonGroup, {
									segmented: true,
									children: [/* @__PURE__ */ jsx(Button, {
										icon: SvgSearchIcon,
										accessibilityLabel: "Search",
										onClick: () => {
											setBlogFiltersMode(IndexFiltersMode.Filtering);
											requestAnimationFrame(() => blogSearchInputRef.current?.focus?.());
										}
									}), /* @__PURE__ */ jsx(Button, {
										icon: SvgFilterIcon,
										accessibilityLabel: "Filters",
										onClick: () => setBlogFiltersMode(IndexFiltersMode.Filtering)
									})]
								})]
							}),
							blogFiltersMode === IndexFiltersMode.Filtering ? /* @__PURE__ */ jsx("div", {
								className: "seoToolsFiltersPanel",
								children: /* @__PURE__ */ jsx(IndexFilters, {
									tabs: [],
									selected: 0,
									onSelect: () => {},
									queryValue: blogQueryValue,
									queryPlaceholder: "Search blog articles",
									onQueryChange: setBlogQueryValue,
									onQueryClear: () => setBlogQueryValue(""),
									queryField: /* @__PURE__ */ jsx(TextField, {
										value: blogQueryValue,
										onChange: setBlogQueryValue,
										placeholder: "Search blog articles",
										prefix: /* @__PURE__ */ jsx(Icon, { source: SvgSearchIcon }),
										autoComplete: "off",
										inputRef: blogSearchInputRef
									}),
									filters: blogFilters,
									appliedFilters: blogAppliedFilters,
									onClearAll: () => {
										setBlogQueryValue("");
										setBlogNamesSelected([]);
										setBlogSeoStatus("");
										setBlogFiltersMode(IndexFiltersMode.Default);
									},
									cancelAction: {
										content: "Cancel",
										onAction: () => setBlogFiltersMode(IndexFiltersMode.Default),
										disabled: false,
										loading: false
									},
									mode: blogFiltersMode,
									setMode: setBlogFiltersMode
								})
							}) : null,
							/* @__PURE__ */ jsx(Modal, {
								open: blogGenModalOpen,
								onClose: () => setBlogGenModalOpen(false),
								title: "Generate",
								primaryAction: {
									content: "Generate",
									onAction: () => {
										setBlogGenModalOpen(false);
										bulkGenerateBlog();
									},
									disabled: !billing.isPro || !blogGenTitle && !blogGenDescription,
									loading: startGenFetcher.state === "submitting"
								},
								secondaryActions: [{
									content: "Cancel",
									onAction: () => setBlogGenModalOpen(false)
								}],
								children: /* @__PURE__ */ jsx(Modal.Section, { children: /* @__PURE__ */ jsxs(BlockStack, {
									gap: "300",
									children: [/* @__PURE__ */ jsx(Text, {
										as: "p",
										variant: "bodyMd",
										children: "Which fields should be generated for the selected blog articles?"
									}), /* @__PURE__ */ jsxs(InlineStack, {
										gap: "400",
										children: [/* @__PURE__ */ jsx(Checkbox$1, {
											label: "Title",
											checked: blogGenTitle,
											onChange: setBlogGenTitle
										}), /* @__PURE__ */ jsx(Checkbox$1, {
											label: "Description",
											checked: blogGenDescription,
											onChange: setBlogGenDescription
										})]
									})]
								}) })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "seoToolsBlogTable",
								style: {
									position: "relative",
									marginLeft: "calc(var(--p-space-400) * -1)",
									marginRight: "calc(var(--p-space-400) * -1)"
								},
								children: [
									!billing.isPro ? /* @__PURE__ */ jsx("div", {
										style: { padding: "0 var(--p-space-400) var(--p-space-300)" },
										children: /* @__PURE__ */ jsx(Banner, {
											tone: "info",
											title: "Pro feature",
											action: {
												content: "Upgrade to Pro",
												url: billingUrl
											},
											children: /* @__PURE__ */ jsx(Text, {
												as: "p",
												variant: "bodyMd",
												children: "Blog article generation is available on the Pro plan."
											})
										})
									}) : null,
									/* @__PURE__ */ jsx(IndexTable, {
										resourceName: {
											singular: "article",
											plural: "articles"
										},
										itemCount: filteredBlogArticles.length,
										selectedItemsCount: allBlogSelected ? "All" : selectedBlogIds.length,
										onSelectionChange: handleBlogSelectionChange,
										promotedBulkActions: blogPromotedBulkActions,
										headings: [
											{ title: "Article" },
											{ title: "Blog" },
											{ title: "Status" },
											{ title: "SEO status" },
											{ title: "SEO title" },
											{ title: "SEO description" }
										],
										children: pagedBlogArticles.map((a, index) => /* @__PURE__ */ jsxs(IndexTable.Row, {
											id: a.id,
											position: index,
											selected: selectedBlogIds.includes(a.id),
											children: [
												/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Text, {
													as: "span",
													variant: "bodyMd",
													fontWeight: "medium",
													children: a.title
												}) }),
												/* @__PURE__ */ jsx(IndexTable.Cell, { children: a.blogTitle }),
												/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Badge, {
													tone: a.isPublished ? "success" : "attention",
													children: a.isPublished ? "Published" : "Draft"
												}) }),
												/* @__PURE__ */ jsx(IndexTable.Cell, { children: (() => {
													const t = String(a?.seoTitle || "").trim();
													const d = String(a?.seoDescription || "").trim();
													const st = t && d ? "filled" : t || d ? "partial" : "empty";
													return /* @__PURE__ */ jsx(Badge, {
														tone: st === "filled" ? "success" : st === "partial" ? "warning" : "subdued",
														children: st === "filled" ? "Filled" : st === "partial" ? "Missing" : "Empty"
													});
												})() }),
												/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Text, {
													as: "span",
													variant: "bodySm",
													children: a.seoTitle || "—"
												}) }),
												/* @__PURE__ */ jsx(IndexTable.Cell, { children: /* @__PURE__ */ jsx(Text, {
													as: "span",
													variant: "bodySm",
													children: a.seoDescription || "—"
												}) })
											]
										}, a.id))
									}),
									/* @__PURE__ */ jsx("div", {
										style: { padding: "var(--p-space-300) var(--p-space-400)" },
										children: /* @__PURE__ */ jsxs(InlineStack, {
											align: "space-between",
											blockAlign: "center",
											gap: "400",
											children: [/* @__PURE__ */ jsx(Text, {
												as: "span",
												variant: "bodySm",
												tone: "subdued",
												children: (() => {
													const total = Number(filteredBlogArticles?.length || 0);
													const limit = Number(blogPageSize || 25);
													const page = Math.max(1, Number(blogPage || 1));
													return `${total === 0 ? 0 : (page - 1) * limit + 1}–${total === 0 ? 0 : Math.min(page * limit, total)} / ${total}`;
												})()
											}), /* @__PURE__ */ jsxs(InlineStack, {
												gap: "300",
												blockAlign: "center",
												children: [/* @__PURE__ */ jsxs(InlineStack, {
													gap: "200",
													blockAlign: "center",
													children: [/* @__PURE__ */ jsx(Text, {
														as: "span",
														variant: "bodySm",
														tone: "subdued",
														children: "Rows"
													}), /* @__PURE__ */ jsx("div", {
														style: { width: 96 },
														children: /* @__PURE__ */ jsx(Select, {
															label: "Rows per page",
															labelHidden: true,
															options: rowsPerPageOptions,
															value: String(blogPageSize || 25),
															onChange: onBlogRowsPerPageChange
														})
													})]
												}), /* @__PURE__ */ jsx(Pagination, {
													hasPrevious: blogPage > 1,
													onPrevious: goBlogPrevPage,
													hasNext: blogPage < blogTotalPages,
													onNext: goBlogNextPage
												})]
											})]
										})
									})
								]
							})
						]
					})
				}) }) }) })
			]
		})
	});
});
/** ---------------- route ErrorBoundary ---------------- */
var ErrorBoundary$2 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const err = useRouteError();
	console.error("SEO Tools ErrorBoundary:", err);
	let bannerTitle = "Something went wrong";
	let message = "Unknown error";
	if (isRouteErrorResponse(err)) {
		bannerTitle = `Error ${err.status}`;
		message = err.data || err.statusText;
	} else if (err instanceof Error) message = err.message;
	else message = String(err);
	return /* @__PURE__ */ jsx(Page, {
		title: "SEO Tools",
		fullWidth: true,
		children: /* @__PURE__ */ jsx(Banner, {
			tone: "critical",
			title: bannerTitle,
			children: /* @__PURE__ */ jsx(Text, {
				as: "p",
				variant: "bodyMd",
				children: message
			})
		})
	});
});
//#endregion
//#region app/routes/app.settings.jsx
var app_settings_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary$1,
	action: () => action$2,
	default: () => app_settings_default,
	loader: () => loader$5
});
/**
* Settings (Sprint 2 - Paket 1)
* - Per-shop settings persisted in Shopify Metafield.
* - Removes localStorage dependency (multi-device friendly).
*/
var SETTINGS_NAMESPACE = "ai_seo_assistant";
var SETTINGS_KEY = "settings";
/** ----------------------- server helpers ----------------------- **/
async function getSettingsFromMetafield(admin) {
	const shop = (await (await admin.graphql(`#graphql
    query GetAiSeoAssistantSettings($namespace: String!, $key: String!) {
      shop {
        id
        metafield(namespace: $namespace, key: $key) {
          id
          type
          value
        }
      }
    }`, { variables: {
		namespace: SETTINGS_NAMESPACE,
		key: SETTINGS_KEY
	} })).json())?.data?.shop;
	const raw = shop?.metafield?.value;
	let settings = null;
	if (raw) try {
		settings = JSON.parse(raw);
	} catch {
		settings = null;
	}
	return {
		shopId: shop?.id,
		settings
	};
}
async function setSettingsMetafield(admin, shopId, settingsObj) {
	const mutation = `#graphql
    mutation SetAiSeoAssistantSettings($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id }
        userErrors { field message }
      }
    }`;
	const base = {
		ownerId: shopId,
		namespace: SETTINGS_NAMESPACE,
		key: SETTINGS_KEY,
		value: JSON.stringify(settingsObj ?? {})
	};
	for (const type of ["json", "json_string"]) {
		const errs = (await (await admin.graphql(mutation, { variables: { metafields: [{
			...base,
			type
		}] } })).json())?.data?.metafieldsSet?.userErrors || [];
		if (!errs.length) return { ok: true };
		if (!errs.some((e) => String(e?.message || "").toLowerCase().includes("type"))) return {
			ok: false,
			errors: errs
		};
	}
	return {
		ok: false,
		errors: [{ message: "Failed to save settings metafield" }]
	};
}
/** ----------------------- Remix/Router loaders ----------------------- **/
var loader$5 = async ({ request }) => {
	const { admin } = await authenticate.admin(request);
	const { settings } = await getSettingsFromMetafield(admin);
	return { settings: settings || null };
};
var action$2 = async ({ request }) => {
	const { admin } = await authenticate.admin(request);
	const form = await request.formData();
	if (String(form.get("intent") || "") !== "save_settings") return {
		ok: false,
		error: "Unknown intent"
	};
	const raw = String(form.get("settingsJson") || "{}");
	let settings = {};
	try {
		settings = JSON.parse(raw);
	} catch {
		settings = {};
	}
	const { shopId } = await getSettingsFromMetafield(admin);
	if (!shopId) return {
		ok: false,
		error: "Shop not found"
	};
	const result = await setSettingsMetafield(admin, shopId, settings);
	if (!result.ok) return {
		ok: false,
		error: "Failed to save settings",
		details: result.errors || []
	};
	return { ok: true };
};
var app_settings_default = UNSAFE_withComponentProps(function Settings() {
	const { settings } = useLoaderData();
	const fetcher = useFetcher();
	const q = useLocation().search || "";
	const defaults = useMemo(() => ({
		language: "tr",
		tone: "default",
		maxLength: "standard",
		apiMode: "auto",
		brandName: "",
		brandVoice: "",
		targetKeyword: "",
		requiredKeywords: "",
		bannedWords: "",
		allowEmojis: false,
		capitalization: "titlecase",
		titleMaxChars: "70",
		descriptionMaxChars: "160",
		titleTemplate: "",
		descriptionTemplate: ""
	}), []);
	const [form, setForm] = useState(defaults);
	const [saved, setSaved] = useState(false);
	useEffect(() => {
		if (settings) setForm({
			...defaults,
			...settings
		});
	}, [defaults, settings]);
	useEffect(() => {
		if (fetcher?.data?.ok) {
			setSaved(true);
			window.setTimeout(() => setSaved(false), 2500);
		}
	}, [fetcher?.data]);
	const set = (key) => (value) => {
		setSaved(false);
		setForm((p) => ({
			...p,
			[key]: value
		}));
	};
	const onSave = () => {
		const fd = new FormData();
		fd.set("intent", "save_settings");
		fd.set("settingsJson", JSON.stringify(form || {}));
		fetcher.submit(fd, { method: "post" });
	};
	return /* @__PURE__ */ jsx(Page, {
		title: "Settings",
		fullWidth: true,
		children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, {
			gap: "400",
			children: [
				saved && /* @__PURE__ */ jsx(Banner, {
					tone: "success",
					title: "Saved",
					children: "Settings saved successfully."
				}),
				fetcher?.data?.ok === false && /* @__PURE__ */ jsx(Banner, {
					tone: "critical",
					title: "Save failed",
					children: fetcher?.data?.error || "Unknown error"
				}),
				/* @__PURE__ */ jsxs(FormLayout, { children: [
					/* @__PURE__ */ jsx(Select, {
						label: "Language",
						options: [
							{
								label: "Turkish (tr)",
								value: "tr"
							},
							{
								label: "English (en)",
								value: "en"
							},
							{
								label: "German (de)",
								value: "de"
							},
							{
								label: "French (fr)",
								value: "fr"
							},
							{
								label: "Spanish (es)",
								value: "es"
							},
							{
								label: "Italian (it)",
								value: "it"
							},
							{
								label: "Dutch (nl)",
								value: "nl"
							},
							{
								label: "Portuguese (pt)",
								value: "pt"
							}
						],
						value: form.language,
						onChange: set("language")
					}),
					/* @__PURE__ */ jsx(Select, {
						label: "Tone",
						options: [
							{
								label: "Default",
								value: "default"
							},
							{
								label: "Professional",
								value: "professional"
							},
							{
								label: "Friendly",
								value: "friendly"
							},
							{
								label: "Luxury",
								value: "luxury"
							},
							{
								label: "Playful",
								value: "playful"
							}
						],
						value: form.tone,
						onChange: set("tone")
					}),
					/* @__PURE__ */ jsx(Select, {
						label: "Max length",
						options: [
							{
								label: "Standard",
								value: "standard"
							},
							{
								label: "Short",
								value: "short"
							},
							{
								label: "Long",
								value: "long"
							}
						],
						value: form.maxLength,
						onChange: set("maxLength")
					}),
					/* @__PURE__ */ jsx(Select, {
						label: "API mode",
						options: [
							{
								label: "Auto",
								value: "auto"
							},
							{
								label: "Fast",
								value: "fast"
							},
							{
								label: "Quality",
								value: "quality"
							}
						],
						value: form.apiMode,
						onChange: set("apiMode")
					}),
					/* @__PURE__ */ jsx(Divider, {}),
					/* @__PURE__ */ jsx(Text, {
						as: "h3",
						variant: "headingMd",
						children: "Brand voice & rules"
					}),
					/* @__PURE__ */ jsx(TextField, {
						label: "Brand name",
						value: form.brandName,
						onChange: set("brandName"),
						autoComplete: "off",
						helpText: "Optional. Used in prompts and templates."
					}),
					/* @__PURE__ */ jsx(TextField, {
						label: "Brand voice (guidelines)",
						value: form.brandVoice,
						onChange: set("brandVoice"),
						autoComplete: "off",
						multiline: 4,
						helpText: "Write your tone, style rules, do/don't, example phrases, etc."
					}),
					/* @__PURE__ */ jsx(TextField, {
						label: "Target keyword",
						value: form.targetKeyword,
						onChange: set("targetKeyword"),
						autoComplete: "off",
						helpText: "Optional. The assistant will try to include it naturally."
					}),
					/* @__PURE__ */ jsx(TextField, {
						label: "Required keywords (comma-separated)",
						value: form.requiredKeywords,
						onChange: set("requiredKeywords"),
						autoComplete: "off",
						helpText: "Example: drawer slide, telescopic rail, soft close"
					}),
					/* @__PURE__ */ jsx(TextField, {
						label: "Banned words (comma-separated)",
						value: form.bannedWords,
						onChange: set("bannedWords"),
						autoComplete: "off",
						helpText: "Words that should not appear in title/description."
					}),
					/* @__PURE__ */ jsx(Checkbox$1, {
						label: "Allow emojis",
						checked: Boolean(form.allowEmojis),
						onChange: (v) => set("allowEmojis")(Boolean(v))
					}),
					/* @__PURE__ */ jsx(Select, {
						label: "Capitalization",
						options: [
							{
								label: "Title Case",
								value: "titlecase"
							},
							{
								label: "Sentence case",
								value: "sentence"
							},
							{
								label: "UPPERCASE",
								value: "uppercase"
							},
							{
								label: "No preference",
								value: "none"
							}
						],
						value: form.capitalization,
						onChange: set("capitalization")
					}),
					/* @__PURE__ */ jsxs(FormLayout.Group, {
						condensed: true,
						children: [/* @__PURE__ */ jsx(TextField, {
							label: "SEO title max chars",
							type: "number",
							value: String(form.titleMaxChars || "70"),
							onChange: set("titleMaxChars"),
							autoComplete: "off"
						}), /* @__PURE__ */ jsx(TextField, {
							label: "SEO description max chars",
							type: "number",
							value: String(form.descriptionMaxChars || "160"),
							onChange: set("descriptionMaxChars"),
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ jsx(Divider, {}),
					/* @__PURE__ */ jsx(Text, {
						as: "h3",
						variant: "headingMd",
						children: "Templates (optional)"
					}),
					/* @__PURE__ */ jsx(TextField, {
						label: "Title template",
						value: form.titleTemplate,
						onChange: set("titleTemplate"),
						autoComplete: "off",
						helpText: "Use placeholders: {productTitle}, {brand}, {keyword}"
					}),
					/* @__PURE__ */ jsx(TextField, {
						label: "Description template",
						value: form.descriptionTemplate,
						onChange: set("descriptionTemplate"),
						autoComplete: "off",
						multiline: 3,
						helpText: "Use placeholders: {productTitle}, {brand}, {keyword}"
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "primary",
						onClick: onSave,
						loading: fetcher.state !== "idle",
						children: "Save settings"
					})
				] }),
				/* @__PURE__ */ jsxs(Text, {
					as: "p",
					variant: "bodySm",
					tone: "subdued",
					children: [
						"These settings are stored per-shop and apply across devices. (Query string preserved: ",
						q,
						")"
					]
				})
			]
		}) }) }) })
	});
});
/** ---------------- error boundary ---------------- */
var ErrorBoundary$1 = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const error = useRouteError();
	let title = "Something went wrong";
	let message = "An unexpected error occurred.";
	if (isRouteErrorResponse(error)) {
		title = `Error ${error.status}`;
		message = error.statusText || message;
	} else if (error instanceof Error) message = error.message;
	return /* @__PURE__ */ jsx(Page, {
		title: "Settings",
		fullWidth: true,
		children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Banner, {
			tone: "critical",
			title,
			children: message
		}) }) })
	});
});
//#endregion
//#region app/routes/app.billing.jsx
var app_billing_exports = /* @__PURE__ */ __exportAll({
	action: () => action$1,
	default: () => app_billing_default,
	loader: () => loader$4
});
function jsonResponse(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json; charset=utf-8" }
	});
}
/**
* billing.request() bazen Response(302) döner (Location header ile),
* bazen JSON (confirmationUrl/url) döndürebilir.
*/
async function extractRedirectUrl(resp) {
	if (!(resp instanceof Response)) return null;
	const loc = resp.headers.get("Location") || resp.headers.get("location");
	if (loc) return loc;
	try {
		const clone = resp.clone();
		if ((clone.headers.get("content-type") || "").includes("application/json")) {
			const j = await clone.json();
			return j?.confirmationUrl || j?.url || null;
		}
	} catch (_) {}
	return null;
}
var PRO_PLAN = "pro";
var loader$4 = async ({ request }) => {
	const { authenticate } = await import("./assets/shopify.server-DYdEFcqS.js");
	const { getBillingContext } = await import("./assets/billing.gating.server-Ct-YnoxI.js");
	const { session, billing } = await authenticate.admin(request);
	const ctx = await getBillingContext({
		shop: session.shop,
		billing
	});
	return jsonResponse({
		shop: session.shop,
		billing: {
			planKey: ctx.planKey,
			isPro: ctx.isPro,
			mode: ctx.mode,
			free: ctx.free
		}
	});
};
var action$1 = async ({ request }) => {
	const { authenticate } = await import("./assets/shopify.server-DYdEFcqS.js");
	const { getBillingContext, isTestBilling } = await import("./assets/billing.gating.server-Ct-YnoxI.js");
	const { session, billing } = await authenticate.admin(request);
	const form = await request.formData();
	const intent = String(form.get("intent") || "");
	const base = process.env.SHOPIFY_APP_URL || new URL(request.url).origin;
	const returnUrl = new URL("/app/billing", base).toString();
	try {
		if (intent === "subscribe_monthly" || intent === "subscribe_annual") {
			const resp = await billing.request({
				plan: PRO_PLAN,
				isTest: isTestBilling(),
				returnUrl
			});
			if (resp instanceof Response) {
				const redirectUrl = await extractRedirectUrl(resp);
				if (!redirectUrl) {
					const status = resp.status;
					const contentType = resp.headers.get("content-type");
					let bodyPreview = "";
					try {
						bodyPreview = await resp.clone().text();
						bodyPreview = bodyPreview?.slice(0, 500) || "";
					} catch (_) {}
					console.error("[BILLING] Missing redirect url", {
						plan: PRO_PLAN,
						returnUrl,
						status,
						contentType,
						bodyPreview
					});
					return jsonResponse({
						ok: false,
						error: "Billing redirect response has no Location header.",
						details: {
							status,
							contentType,
							bodyPreview,
							returnUrl
						}
					}, 500);
				}
				return jsonResponse({
					ok: true,
					redirectUrl
				});
			}
			if (resp && typeof resp === "object") {
				const redirectUrl = resp.confirmationUrl || resp.url;
				if (redirectUrl) return jsonResponse({
					ok: true,
					redirectUrl
				});
			}
			return jsonResponse({
				ok: false,
				error: "Unknown billing response shape."
			}, 500);
		}
		if (intent === "cancel") {
			const sub = (await getBillingContext({
				shop: session.shop,
				billing
			})).activeSubscription;
			if (!sub?.id) return jsonResponse({
				ok: false,
				error: "No active subscription found."
			}, 400);
			await billing.cancel({
				subscriptionId: sub.id,
				isTest: isTestBilling(),
				prorate: true
			});
			return jsonResponse({ ok: true });
		}
		if (intent === "reset_usage") {
			if (process.env.NODE_ENV === "production") return jsonResponse({
				ok: false,
				error: "Not allowed in production"
			}, 403);
			const { resetFreeUsageMonthly } = await import("./assets/billing.usage.server-BmkjtQvW.js");
			await resetFreeUsageMonthly(session.shop);
			return jsonResponse({ ok: true });
		}
		return jsonResponse({
			ok: false,
			error: "Unknown intent"
		}, 400);
	} catch (e) {
		if (e instanceof Response) {
			const redirectUrl = await extractRedirectUrl(e);
			if (redirectUrl) return jsonResponse({
				ok: true,
				redirectUrl
			});
			return e;
		}
		const msg = e instanceof Error ? e.message : String(e);
		console.error("[BILLING] action error:", e);
		return jsonResponse({
			ok: false,
			error: msg
		}, 500);
	}
};
var app_billing_default = UNSAFE_withComponentProps(function Billing() {
	const { billing } = useLoaderData();
	const fetcher = useFetcher();
	const error = fetcher.data?.ok === false ? fetcher.data?.error : null;
	useEffect(() => {
		const redirectUrl = fetcher.data?.redirectUrl;
		if (!redirectUrl) return;
		try {
			if (window.top) window.top.location.href = redirectUrl;
			else window.location.href = redirectUrl;
		} catch (_e) {
			window.location.href = redirectUrl;
		}
	}, [fetcher.data]);
	useEffect(() => {
		if (fetcher.state === "idle" && fetcher.data?.ok && !fetcher.data?.redirectUrl) window.location.reload();
	}, [fetcher.state, fetcher.data]);
	const free = billing?.free || {
		used: 0,
		remaining: 0,
		limit: 0,
		month: ""
	};
	const usageText = `${free.used}/${free.limit} used · ${free.remaining} remaining`;
	const monthLabel = free.month ? `Resets monthly (period: ${free.month})` : "Resets monthly";
	const proActive = billing?.isPro;
	const isSubmitting = fetcher.state !== "idle";
	const freeFeatures = useMemo(() => [
		"Up to 10 products / month",
		"Generate product meta title & description",
		"Generation history",
		"Basic support"
	], []);
	const proFeatures = useMemo(() => [
		"Unlimited product generations",
		"Image ALT text generation",
		"Blog article SEO generation",
		"Bulk generate + bulk apply/publish",
		"Advanced filters & interactive tables",
		"Priority queue processing",
		"Retry failed items",
		"Detailed error insights"
	], []);
	return /* @__PURE__ */ jsx(Page, {
		title: "Billing",
		children: /* @__PURE__ */ jsxs(BlockStack, {
			gap: "400",
			children: [error ? /* @__PURE__ */ jsxs(Banner, {
				tone: "critical",
				title: "Billing error",
				children: [/* @__PURE__ */ jsx(Text, {
					as: "p",
					variant: "bodyMd",
					children: String(error)
				}), fetcher.data?.details ? /* @__PURE__ */ jsx(Text, {
					as: "p",
					variant: "bodySm",
					tone: "subdued",
					children: JSON.stringify(fetcher.data.details)
				}) : null]
			}) : null, /* @__PURE__ */ jsxs(Layout, { children: [/* @__PURE__ */ jsx(Layout.Section, {
				variant: "oneHalf",
				children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, {
					gap: "300",
					children: [
						/* @__PURE__ */ jsxs(InlineStack, {
							align: "space-between",
							blockAlign: "center",
							children: [/* @__PURE__ */ jsxs(BlockStack, {
								gap: "100",
								children: [/* @__PURE__ */ jsx(Text, {
									variant: "headingMd",
									as: "h2",
									children: "Free Plan"
								}), /* @__PURE__ */ jsx(Text, {
									as: "p",
									variant: "bodySm",
									tone: "subdued",
									children: "For trying the app"
								})]
							}), /* @__PURE__ */ jsx(Badge, {
								tone: !proActive ? "success" : void 0,
								children: !proActive ? "Current" : "Available"
							})]
						}),
						/* @__PURE__ */ jsx(Divider, {}),
						/* @__PURE__ */ jsxs(BlockStack, {
							gap: "150",
							children: [
								/* @__PURE__ */ jsxs(Text, {
									as: "p",
									variant: "bodyMd",
									children: [
										/* @__PURE__ */ jsx("b", { children: "Monthly limit:" }),
										" ",
										free.limit,
										" products"
									]
								}),
								/* @__PURE__ */ jsxs(Text, {
									as: "p",
									variant: "bodyMd",
									children: [
										/* @__PURE__ */ jsx("b", { children: "Usage:" }),
										" ",
										usageText
									]
								}),
								/* @__PURE__ */ jsx(Text, {
									as: "p",
									variant: "bodySm",
									tone: "subdued",
									children: monthLabel
								})
							]
						}),
						/* @__PURE__ */ jsx(Divider, {}),
						/* @__PURE__ */ jsxs(BlockStack, {
							gap: "150",
							children: [/* @__PURE__ */ jsx(Text, {
								as: "h3",
								variant: "headingSm",
								children: "Features"
							}), /* @__PURE__ */ jsx(List, { children: freeFeatures.map((f) => /* @__PURE__ */ jsx(List.Item, { children: f }, f)) })]
						}),
						/* @__PURE__ */ jsx(Divider, {}),
						/* @__PURE__ */ jsxs(fetcher.Form, {
							method: "post",
							children: [/* @__PURE__ */ jsx("input", {
								type: "hidden",
								name: "intent",
								value: "reset_usage"
							}), /* @__PURE__ */ jsx(Button, {
								tone: "critical",
								variant: "secondary",
								disabled: isSubmitting,
								children: "Reset usage (dev)"
							})]
						})
					]
				}) })
			}), /* @__PURE__ */ jsx(Layout.Section, {
				variant: "oneHalf",
				children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, {
					gap: "300",
					children: [
						/* @__PURE__ */ jsxs(InlineStack, {
							align: "space-between",
							blockAlign: "center",
							children: [/* @__PURE__ */ jsxs(BlockStack, {
								gap: "100",
								children: [/* @__PURE__ */ jsx(Text, {
									variant: "headingMd",
									as: "h2",
									children: "Pro Plan"
								}), /* @__PURE__ */ jsx(Text, {
									as: "p",
									variant: "bodySm",
									tone: "subdued",
									children: "Unlimited + advanced tools"
								})]
							}), /* @__PURE__ */ jsx(Badge, {
								tone: proActive ? "success" : void 0,
								children: proActive ? "Active" : "Upgrade"
							})]
						}),
						/* @__PURE__ */ jsx(Divider, {}),
						/* @__PURE__ */ jsxs(BlockStack, {
							gap: "200",
							children: [/* @__PURE__ */ jsxs(Text, {
								as: "p",
								variant: "bodyMd",
								children: [/* @__PURE__ */ jsx("b", { children: "Monthly:" }), " $19.90 / month"]
							}), /* @__PURE__ */ jsxs(Text, {
								as: "p",
								variant: "bodyMd",
								children: [/* @__PURE__ */ jsx("b", { children: "Annual:" }), " $200 / year"]
							})]
						}),
						/* @__PURE__ */ jsx(Divider, {}),
						/* @__PURE__ */ jsxs(BlockStack, {
							gap: "150",
							children: [/* @__PURE__ */ jsx(Text, {
								as: "h3",
								variant: "headingSm",
								children: "Features"
							}), /* @__PURE__ */ jsx(List, { children: proFeatures.map((f) => /* @__PURE__ */ jsx(List.Item, { children: f }, f)) })]
						}),
						/* @__PURE__ */ jsx(Divider, {}),
						!proActive ? /* @__PURE__ */ jsxs(InlineStack, {
							gap: "200",
							children: [/* @__PURE__ */ jsxs(fetcher.Form, {
								method: "post",
								children: [/* @__PURE__ */ jsx("input", {
									type: "hidden",
									name: "intent",
									value: "subscribe_monthly"
								}), /* @__PURE__ */ jsx(Button, {
									submit: true,
									variant: "primary",
									loading: isSubmitting,
									disabled: isSubmitting,
									children: "Start Monthly"
								})]
							}), /* @__PURE__ */ jsxs(fetcher.Form, {
								method: "post",
								children: [/* @__PURE__ */ jsx("input", {
									type: "hidden",
									name: "intent",
									value: "subscribe_annual"
								}), /* @__PURE__ */ jsx(Button, {
									submit: true,
									variant: "secondary",
									loading: isSubmitting,
									disabled: isSubmitting,
									children: "Start Annual"
								})]
							})]
						}) : /* @__PURE__ */ jsxs(fetcher.Form, {
							method: "post",
							children: [/* @__PURE__ */ jsx("input", {
								type: "hidden",
								name: "intent",
								value: "cancel"
							}), /* @__PURE__ */ jsx(Button, {
								submit: true,
								tone: "critical",
								loading: isSubmitting,
								disabled: isSubmitting,
								children: "Cancel subscription"
							})]
						})
					]
				}) })
			})] })]
		})
	});
});
//#endregion
//#region app/routes/app.privacy.jsx
var app_privacy_exports = /* @__PURE__ */ __exportAll({
	default: () => app_privacy_default,
	headers: () => headers$3,
	loader: () => loader$3
});
var loader$3 = async ({ request }) => {
	await authenticate.admin(request);
	const url = process.env.PRIVACY_URL || "https://example.com/privacy";
	return new Response(null, {
		status: 302,
		headers: { Location: url }
	});
};
var headers$3 = (headersArgs) => boundary.headers(headersArgs);
var app_privacy_default = UNSAFE_withComponentProps(function Redirect() {
	return null;
});
//#endregion
//#region app/routes/app.support.jsx
var app_support_exports = /* @__PURE__ */ __exportAll({
	default: () => app_support_default,
	headers: () => headers$2,
	loader: () => loader$2
});
var loader$2 = async ({ request }) => {
	await authenticate.admin(request);
	const url = process.env.SUPPORT_URL || "https://example.com/support";
	return new Response(null, {
		status: 302,
		headers: { Location: url }
	});
};
var headers$2 = (headersArgs) => boundary.headers(headersArgs);
var app_support_default = UNSAFE_withComponentProps(function Redirect() {
	return null;
});
//#endregion
//#region app/routes/app._index.jsx
var app__index_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	action: () => action,
	default: () => app__index_default,
	headers: () => headers$1,
	loader: () => loader$1
});
var loader$1 = async ({ request }) => {
	await authenticate.admin(request);
	return null;
};
var action = async ({ request }) => {
	const { admin } = await authenticate.admin(request);
	const formData = await request.formData();
	if (String(formData.get("intent") || "") !== "create_sample_product") return {
		ok: false,
		error: "Unknown intent"
	};
	const title = `${[
		"Red",
		"Orange",
		"Yellow",
		"Green"
	][Math.floor(Math.random() * 4)]} Snowboard (AI SEO Assistant)`;
	const payload = (await (await admin.graphql(`#graphql
    mutation CreateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product { id title handle }
        userErrors { field message }
      }
    }
  `, { variables: { input: { title } } })).json())?.data?.productCreate;
	const userErrors = payload?.userErrors || [];
	if (userErrors.length) return {
		ok: false,
		userErrors
	};
	return {
		ok: true,
		product: payload?.product
	};
};
var app__index_default = UNSAFE_withComponentProps(function AppHome() {
	const location = useLocation();
	const withSearch = (path) => `${path}${location.search || ""}`;
	const fetcher = useFetcher();
	const data = fetcher.data;
	const hasErrors = Array.isArray(data?.userErrors) && data.userErrors.length > 0;
	const jsonPretty = useMemo(() => {
		if (!data) return "";
		try {
			return JSON.stringify(data, null, 2);
		} catch {
			return String(data);
		}
	}, [data]);
	return /* @__PURE__ */ jsx(Page, {
		title: "AI SEO Assistant",
		children: /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsx(Layout.Section, { children: /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, {
			gap: "400",
			children: [
				/* @__PURE__ */ jsx(Text, {
					as: "p",
					variant: "bodyMd",
					children: "This app uses Shopify Polaris for a native Admin look & feel."
				}),
				/* @__PURE__ */ jsxs(InlineStack, {
					gap: "300",
					align: "start",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "primary",
						loading: fetcher.state !== "idle",
						onClick: () => fetcher.submit({ intent: "create_sample_product" }, { method: "post" }),
						children: "Create a sample product"
					}), /* @__PURE__ */ jsx(Button, {
						url: "https://shopify.dev/docs/api/admin-graphql",
						external: true,
						children: "Admin GraphQL docs"
					})]
				}),
				data && /* @__PURE__ */ jsxs(Fragment, { children: [hasErrors ? /* @__PURE__ */ jsx(Banner, {
					title: "Shopify returned errors",
					tone: "critical",
					children: /* @__PURE__ */ jsx(BlockStack, {
						gap: "200",
						children: data.userErrors.map((e, i) => /* @__PURE__ */ jsx(Text, {
							as: "p",
							variant: "bodyMd",
							children: e.message
						}, i))
					})
				}) : data.ok ? /* @__PURE__ */ jsx(Banner, {
					title: "Done",
					tone: "success",
					children: /* @__PURE__ */ jsx(Text, {
						as: "p",
						variant: "bodyMd",
						children: "Sample product created successfully."
					})
				}) : data.error ? /* @__PURE__ */ jsx(Banner, {
					title: "Error",
					tone: "critical",
					children: /* @__PURE__ */ jsx(Text, {
						as: "p",
						variant: "bodyMd",
						children: data.error
					})
				}) : null, /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(BlockStack, {
					gap: "200",
					children: [/* @__PURE__ */ jsx(Text, {
						as: "h2",
						variant: "headingMd",
						children: "Response"
					}), /* @__PURE__ */ jsx(TextField, {
						label: "",
						value: jsonPretty,
						multiline: 10,
						readOnly: true,
						monospaced: true,
						autoComplete: "off"
					})]
				}) })] }),
				/* @__PURE__ */ jsxs(Text, {
					as: "p",
					variant: "bodySm",
					tone: "subdued",
					children: [
						"Tip: Use the",
						" ",
						/* @__PURE__ */ jsx(Link, {
							to: withSearch("/app/seo-tools"),
							children: "SEO Tools"
						}),
						" ",
						"page to generate SEO titles/descriptions with Polaris UI."
					]
				})
			]
		}) }) }) })
	});
});
var headers$1 = (headersArgs) => boundary.headers(headersArgs);
/** ---------------- route ErrorBoundary ---------------- */
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary() {
	const err = useRouteError();
	console.error("Dashboard ErrorBoundary:", err);
	let bannerTitle = "Something went wrong";
	let message = "Unknown error";
	if (isRouteErrorResponse(err)) {
		bannerTitle = `Error ${err.status}`;
		message = err.data || err.statusText;
	} else if (err instanceof Error) message = err.message;
	else message = String(err);
	return /* @__PURE__ */ jsx(Page, {
		title: "Dashboard",
		fullWidth: true,
		children: /* @__PURE__ */ jsx(Banner, {
			tone: "critical",
			title: bannerTitle,
			children: /* @__PURE__ */ jsx(Text, {
				as: "p",
				variant: "bodyMd",
				children: message
			})
		})
	});
});
//#endregion
//#region app/routes/app.terms.jsx
var app_terms_exports = /* @__PURE__ */ __exportAll({
	default: () => app_terms_default,
	headers: () => headers,
	loader: () => loader
});
var loader = async ({ request }) => {
	await authenticate.admin(request);
	const url = process.env.TERMS_URL || "https://example.com/terms";
	return new Response(null, {
		status: 302,
		headers: { Location: url }
	});
};
var headers = (headersArgs) => boundary.headers(headersArgs);
var app_terms_default = UNSAFE_withComponentProps(function Redirect() {
	return null;
});
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-2VKSRK9h.js",
		"imports": [
			"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
			"/assets/react-dom-BLfcpCoe.js",
			"/assets/jsx-runtime-DH9-qhHI.js"
		],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/root-u4hP7oy3.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/react-dom-BLfcpCoe.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/context-DCabL2qx.js",
				"/assets/context-KVAw-1Cn.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/auth.login": {
			"id": "routes/auth.login",
			"parentId": "root",
			"path": "auth/login",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/route-CIY0InVI.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/Page-BNa-5ixz.js",
				"/assets/Banner-BosuaafW.js",
				"/assets/Card-Cj-qXULP.js",
				"/assets/Layout-B8kURo9S.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/context-DCabL2qx.js",
				"/assets/react-dom-BLfcpCoe.js",
				"/assets/banner-context-BTszhttC.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/webhooks": {
			"id": "routes/webhooks",
			"parentId": "root",
			"path": "webhooks",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/webhooks-CQUCUAbH.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/webhooks.customers.data_request": {
			"id": "routes/webhooks.customers.data_request",
			"parentId": "routes/webhooks",
			"path": "customers/data_request",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/webhooks.customers.data_request-CBj73FVr.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/webhooks.app.scopes_update": {
			"id": "routes/webhooks.app.scopes_update",
			"parentId": "routes/webhooks",
			"path": "app/scopes_update",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/webhooks.app.scopes_update-DTGnVt6I.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/webhooks.customers.redact": {
			"id": "routes/webhooks.customers.redact",
			"parentId": "routes/webhooks",
			"path": "customers/redact",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/webhooks.customers.redact-Bgp60R_Y.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/webhooks.app.uninstalled": {
			"id": "routes/webhooks.app.uninstalled",
			"parentId": "routes/webhooks",
			"path": "app/uninstalled",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/webhooks.app.uninstalled-CBede_pa.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/webhooks.shop.redact": {
			"id": "routes/webhooks.shop.redact",
			"parentId": "routes/webhooks",
			"path": "shop/redact",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/webhooks.shop.redact-BUoB9sfA.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/_index": {
			"id": "routes/_index",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/route-BlSSh5HG.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/Page-BNa-5ixz.js",
				"/assets/Card-Cj-qXULP.js",
				"/assets/Layout-B8kURo9S.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/context-DCabL2qx.js",
				"/assets/react-dom-BLfcpCoe.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/auth.$": {
			"id": "routes/auth.$",
			"parentId": "root",
			"path": "auth/*",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/auth._-BQD_UIB2.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app": {
			"id": "routes/app",
			"parentId": "root",
			"path": "app",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/app-DuOP-78C.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/Page-BNa-5ixz.js",
				"/assets/Banner-BosuaafW.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/context-DCabL2qx.js",
				"/assets/react-dom-BLfcpCoe.js",
				"/assets/banner-context-BTszhttC.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app.debug-report.$jobId": {
			"id": "routes/app.debug-report.$jobId",
			"parentId": "routes/app",
			"path": "debug-report/:jobId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/app.debug-report._jobId-Bi6nbRwd.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app.generation-history": {
			"id": "routes/app.generation-history",
			"parentId": "routes/app",
			"path": "generation-history",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/app.generation-history-B1mPkHEG.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/Page-BNa-5ixz.js",
				"/assets/Banner-BosuaafW.js",
				"/assets/IndexTable-BUS8SDLd.js",
				"/assets/Card-Cj-qXULP.js",
				"/assets/Layout-B8kURo9S.js",
				"/assets/ProgressBar-J_SQ70GB.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/context-DCabL2qx.js",
				"/assets/react-dom-BLfcpCoe.js",
				"/assets/banner-context-BTszhttC.js",
				"/assets/Modal-x_R64ZrU.js",
				"/assets/CSSTransition-Dmbocu3o.js",
				"/assets/Checkbox-4d1g7CD-.js",
				"/assets/FormLayout-CQgJyH4j.js",
				"/assets/context-KVAw-1Cn.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app.generation-history.$jobId": {
			"id": "routes/app.generation-history.$jobId",
			"parentId": "routes/app.generation-history",
			"path": ":jobId",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/app.generation-history._jobId-Oiw_HUYo.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/Modal-x_R64ZrU.js",
				"/assets/CSSTransition-Dmbocu3o.js",
				"/assets/Page-BNa-5ixz.js",
				"/assets/Banner-BosuaafW.js",
				"/assets/Checkbox-4d1g7CD-.js",
				"/assets/context-DCabL2qx.js",
				"/assets/Card-Cj-qXULP.js",
				"/assets/Divider-DyQHWfX5.js",
				"/assets/Layout-B8kURo9S.js",
				"/assets/ProgressBar-J_SQ70GB.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/context-KVAw-1Cn.js",
				"/assets/react-dom-BLfcpCoe.js",
				"/assets/banner-context-BTszhttC.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app.additional": {
			"id": "routes/app.additional",
			"parentId": "routes/app",
			"path": "additional",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/app.additional-IoGzCafm.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/Page-BNa-5ixz.js",
				"/assets/Card-Cj-qXULP.js",
				"/assets/Layout-B8kURo9S.js",
				"/assets/banner-context-BTszhttC.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/context-DCabL2qx.js",
				"/assets/react-dom-BLfcpCoe.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app.onboarding": {
			"id": "routes/app.onboarding",
			"parentId": "routes/app",
			"path": "onboarding",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/app.onboarding-Y6BORRbC.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/Page-BNa-5ixz.js",
				"/assets/Banner-BosuaafW.js",
				"/assets/Card-Cj-qXULP.js",
				"/assets/Divider-DyQHWfX5.js",
				"/assets/List-BRe_nbPB.js",
				"/assets/ProgressBar-J_SQ70GB.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/context-DCabL2qx.js",
				"/assets/react-dom-BLfcpCoe.js",
				"/assets/banner-context-BTszhttC.js",
				"/assets/CSSTransition-Dmbocu3o.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app.seo-tools": {
			"id": "routes/app.seo-tools",
			"parentId": "routes/app",
			"path": "seo-tools",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/app.seo-tools-F6gVCw3Z.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/Modal-x_R64ZrU.js",
				"/assets/Page-BNa-5ixz.js",
				"/assets/Banner-BosuaafW.js",
				"/assets/IndexTable-BUS8SDLd.js",
				"/assets/Checkbox-4d1g7CD-.js",
				"/assets/Card-Cj-qXULP.js",
				"/assets/Layout-B8kURo9S.js",
				"/assets/Select-CsBacE0k.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/CSSTransition-Dmbocu3o.js",
				"/assets/context-DCabL2qx.js",
				"/assets/context-KVAw-1Cn.js",
				"/assets/react-dom-BLfcpCoe.js",
				"/assets/banner-context-BTszhttC.js",
				"/assets/FormLayout-CQgJyH4j.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app.settings": {
			"id": "routes/app.settings",
			"parentId": "routes/app",
			"path": "settings",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/app.settings-Bv1a7zZa.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/Page-BNa-5ixz.js",
				"/assets/Banner-BosuaafW.js",
				"/assets/Checkbox-4d1g7CD-.js",
				"/assets/Card-Cj-qXULP.js",
				"/assets/Divider-DyQHWfX5.js",
				"/assets/FormLayout-CQgJyH4j.js",
				"/assets/Layout-B8kURo9S.js",
				"/assets/Select-CsBacE0k.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/context-DCabL2qx.js",
				"/assets/react-dom-BLfcpCoe.js",
				"/assets/banner-context-BTszhttC.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app.billing": {
			"id": "routes/app.billing",
			"parentId": "routes/app",
			"path": "billing",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/app.billing-CjB7o-Js.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/Page-BNa-5ixz.js",
				"/assets/Banner-BosuaafW.js",
				"/assets/Card-Cj-qXULP.js",
				"/assets/Divider-DyQHWfX5.js",
				"/assets/Layout-B8kURo9S.js",
				"/assets/List-BRe_nbPB.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/context-DCabL2qx.js",
				"/assets/react-dom-BLfcpCoe.js",
				"/assets/banner-context-BTszhttC.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app.privacy": {
			"id": "routes/app.privacy",
			"parentId": "routes/app",
			"path": "privacy",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/app.privacy-BlOWDpPu.js",
			"imports": ["/assets/chunk-5KNZJZUH-CXZH0_bv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app.support": {
			"id": "routes/app.support",
			"parentId": "routes/app",
			"path": "support",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/app.support-BCYoBF-9.js",
			"imports": ["/assets/chunk-5KNZJZUH-CXZH0_bv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app._index": {
			"id": "routes/app._index",
			"parentId": "routes/app",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/app._index-B_YoTpAg.js",
			"imports": [
				"/assets/chunk-5KNZJZUH-CXZH0_bv.js",
				"/assets/Page-BNa-5ixz.js",
				"/assets/Banner-BosuaafW.js",
				"/assets/Card-Cj-qXULP.js",
				"/assets/Layout-B8kURo9S.js",
				"/assets/jsx-runtime-DH9-qhHI.js",
				"/assets/context-DCabL2qx.js",
				"/assets/react-dom-BLfcpCoe.js",
				"/assets/banner-context-BTszhttC.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/app.terms": {
			"id": "routes/app.terms",
			"parentId": "routes/app",
			"path": "terms",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/app.terms-04ALtcrr.js",
			"imports": ["/assets/chunk-5KNZJZUH-CXZH0_bv.js"],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-c726d4a7.js",
	"version": "c726d4a7",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = {
	"unstable_optimizeDeps": false,
	"v8_passThroughRequests": false,
	"unstable_trailingSlashAwareDataRequests": false,
	"unstable_previewServerPrerendering": false,
	"v8_middleware": false,
	"v8_splitRouteModules": false,
	"v8_viteEnvironmentApi": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/auth.login": {
		id: "routes/auth.login",
		parentId: "root",
		path: "auth/login",
		index: void 0,
		caseSensitive: void 0,
		module: route_exports$1
	},
	"routes/webhooks": {
		id: "routes/webhooks",
		parentId: "root",
		path: "webhooks",
		index: void 0,
		caseSensitive: void 0,
		module: webhooks_exports
	},
	"routes/webhooks.customers.data_request": {
		id: "routes/webhooks.customers.data_request",
		parentId: "routes/webhooks",
		path: "customers/data_request",
		index: void 0,
		caseSensitive: void 0,
		module: webhooks_customers_data_request_exports
	},
	"routes/webhooks.app.scopes_update": {
		id: "routes/webhooks.app.scopes_update",
		parentId: "routes/webhooks",
		path: "app/scopes_update",
		index: void 0,
		caseSensitive: void 0,
		module: webhooks_app_scopes_update_exports
	},
	"routes/webhooks.customers.redact": {
		id: "routes/webhooks.customers.redact",
		parentId: "routes/webhooks",
		path: "customers/redact",
		index: void 0,
		caseSensitive: void 0,
		module: webhooks_customers_redact_exports
	},
	"routes/webhooks.app.uninstalled": {
		id: "routes/webhooks.app.uninstalled",
		parentId: "routes/webhooks",
		path: "app/uninstalled",
		index: void 0,
		caseSensitive: void 0,
		module: webhooks_app_uninstalled_exports
	},
	"routes/webhooks.shop.redact": {
		id: "routes/webhooks.shop.redact",
		parentId: "routes/webhooks",
		path: "shop/redact",
		index: void 0,
		caseSensitive: void 0,
		module: webhooks_shop_redact_exports
	},
	"routes/_index": {
		id: "routes/_index",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: route_exports
	},
	"routes/auth.$": {
		id: "routes/auth.$",
		parentId: "root",
		path: "auth/*",
		index: void 0,
		caseSensitive: void 0,
		module: auth_$_exports
	},
	"routes/app": {
		id: "routes/app",
		parentId: "root",
		path: "app",
		index: void 0,
		caseSensitive: void 0,
		module: app_exports
	},
	"routes/app.debug-report.$jobId": {
		id: "routes/app.debug-report.$jobId",
		parentId: "routes/app",
		path: "debug-report/:jobId",
		index: void 0,
		caseSensitive: void 0,
		module: app_debug_report_$jobId_exports
	},
	"routes/app.generation-history": {
		id: "routes/app.generation-history",
		parentId: "routes/app",
		path: "generation-history",
		index: void 0,
		caseSensitive: void 0,
		module: app_generation_history_exports
	},
	"routes/app.generation-history.$jobId": {
		id: "routes/app.generation-history.$jobId",
		parentId: "routes/app.generation-history",
		path: ":jobId",
		index: void 0,
		caseSensitive: void 0,
		module: app_generation_history_$jobId_exports
	},
	"routes/app.additional": {
		id: "routes/app.additional",
		parentId: "routes/app",
		path: "additional",
		index: void 0,
		caseSensitive: void 0,
		module: app_additional_exports
	},
	"routes/app.onboarding": {
		id: "routes/app.onboarding",
		parentId: "routes/app",
		path: "onboarding",
		index: void 0,
		caseSensitive: void 0,
		module: app_onboarding_exports
	},
	"routes/app.seo-tools": {
		id: "routes/app.seo-tools",
		parentId: "routes/app",
		path: "seo-tools",
		index: void 0,
		caseSensitive: void 0,
		module: app_seo_tools_exports
	},
	"routes/app.settings": {
		id: "routes/app.settings",
		parentId: "routes/app",
		path: "settings",
		index: void 0,
		caseSensitive: void 0,
		module: app_settings_exports
	},
	"routes/app.billing": {
		id: "routes/app.billing",
		parentId: "routes/app",
		path: "billing",
		index: void 0,
		caseSensitive: void 0,
		module: app_billing_exports
	},
	"routes/app.privacy": {
		id: "routes/app.privacy",
		parentId: "routes/app",
		path: "privacy",
		index: void 0,
		caseSensitive: void 0,
		module: app_privacy_exports
	},
	"routes/app.support": {
		id: "routes/app.support",
		parentId: "routes/app",
		path: "support",
		index: void 0,
		caseSensitive: void 0,
		module: app_support_exports
	},
	"routes/app._index": {
		id: "routes/app._index",
		parentId: "routes/app",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: app__index_exports
	},
	"routes/app.terms": {
		id: "routes/app.terms",
		parentId: "routes/app",
		path: "terms",
		index: void 0,
		caseSensitive: void 0,
		module: app_terms_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
