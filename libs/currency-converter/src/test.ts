// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';

import '@angular/localize/init';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Attempt to mock global $localize function.
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _global: any = typeof global !== 'undefined' && global;
const defaultFakedLocalizeTranslate: (messageParts: TemplateStringsArray,
                                      substitutions: readonly unknown[]) => [TemplateStringsArray, readonly unknown[]] =
  (messageParts: TemplateStringsArray, substitutions: readonly unknown[]) => {
    return [messageParts, substitutions];
  };

_global.mockLocalize = createSpy('mockLocalize') as Spy;

$localize.translate = mockLocalize.and.callFake(defaultFakedLocalizeTranslate);

declare global {
  const mockLocalize: Spy;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
