import { IComparatorFunction, IMatcherFunction, IStyleAPI, IStyleItem } from 'import-sort-style';

export default function(styleApi: IStyleAPI): IStyleItem[] {
  const {
    and,
    hasDefaultMember,
    hasNamedMembers,
    hasNamespaceMember,
    hasNoMember,
    hasOnlyDefaultMember,
    hasOnlyNamedMembers,
    hasOnlyNamespaceMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    member,
    moduleName,
    name,
    not,
    startsWithAlphanumeric,
    startsWithLowerCase,
    startsWithUpperCase,
    unicode,
  } = styleApi;

  const fixedOrder = [
    '@babel/polyfill',
    'babel-polyfill',
    'core-js/stable',
    'regenerator-runtime/runtime',
    'react',
    'react-dom',
    'react-native',
    'prop-types',
  ];
  const fixedOrderMatch: IMatcherFunction = imported => {
    return fixedOrder.indexOf(imported.moduleName) >= 0;
  };
  const fixedOrderComparator: IComparatorFunction = (name1, name2) => {
    const i1 = fixedOrder.indexOf(name1);
    const i2 = fixedOrder.indexOf(name2);
    return i1 - i2;
  };

  return [
    { match: fixedOrderMatch, sort: moduleName(fixedOrderComparator) },
    { separator: true },

    // import node modules;
    { match: isNodeModule, sort: moduleName(unicode) },
    { separator: true },

    // import _ from "bar";
    // { match: and(hasOnlyDefaultMember, isAbsoluteModule, not(member(startsWithAlphanumeric))), sort: moduleName(unicode) },
    // import _, * as bar from "baz";
    // { match: and(hasDefaultMember, hasNamespaceMember, isAbsoluteModule, not(member(startsWithAlphanumeric))), sort: moduleName(unicode) },
    // import _, {bar, …} from "baz";
    // { match: and(hasDefaultMember, hasNamedMembers, isAbsoluteModule, not(member(startsWithAlphanumeric))), sort: moduleName(unicode), sortNamedMembers: name(unicode) },
    {
      match: and(hasDefaultMember, isAbsoluteModule, not(member(startsWithAlphanumeric))),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },

    // import Foo from "bar";
    // { match: and(hasOnlyDefaultMember, isAbsoluteModule, member(startsWithUpperCase)), sort: moduleName(unicode) },
    // import Foo, * as bar from "baz";
    // { match: and(hasDefaultMember, hasNamespaceMember, isAbsoluteModule, member(startsWithUpperCase)), sort: moduleName(unicode) },
    // import Foo, {bar, …} from "baz";
    // { match: and(hasDefaultMember, hasNamedMembers, isAbsoluteModule, member(startsWithUpperCase)), sort: moduleName(unicode), sortNamedMembers: name(unicode) },
    {
      match: and(hasDefaultMember, isAbsoluteModule, member(startsWithUpperCase)),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },

    { separator: true },

    // import foo from "bar";
    // { match: and(hasOnlyDefaultMember, isAbsoluteModule, member(startsWithLowerCase)), sort: moduleName(unicode) },
    // import foo, * as bar from "baz";
    // { match: and(hasDefaultMember, hasNamespaceMember, isAbsoluteModule, member(startsWithUpperCase)), sort: moduleName(unicode) },
    // import foo, {bar, …} from "baz";
    // { match: and(hasDefaultMember, hasNamedMembers, isAbsoluteModule, member(startsWithLowerCase)), sort: moduleName(unicode), sortNamedMembers: name(unicode) },
    {
      match: and(hasDefaultMember, isAbsoluteModule, member(startsWithLowerCase)),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },

    { separator: true },

    // import * as _ from "bar";
    {
      match: and(hasOnlyNamespaceMember, isAbsoluteModule, not(member(startsWithAlphanumeric))),
      sort: moduleName(unicode),
    },
    // import * as Foo from "bar";
    { match: and(hasOnlyNamespaceMember, isAbsoluteModule, member(startsWithUpperCase)), sort: moduleName(unicode) },
    // import * as foo from "bar";
    { match: and(hasOnlyNamespaceMember, isAbsoluteModule, member(startsWithLowerCase)), sort: moduleName(unicode) },

    { separator: true },

    // import {_, bar, …} from "baz";
    {
      match: and(hasOnlyNamedMembers, isAbsoluteModule, not(member(startsWithAlphanumeric))),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },
    // import {Foo, bar, …} from "baz";
    {
      match: and(hasOnlyNamedMembers, isAbsoluteModule, member(startsWithUpperCase)),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },
    // import {foo, bar, …} from "baz";
    {
      match: and(hasOnlyNamedMembers, isAbsoluteModule, member(startsWithLowerCase)),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },

    { separator: true },

    // import "foo"
    { match: and(hasNoMember, isAbsoluteModule) },

    { separator: true },

    // import _ from "./bar";
    // { match: and(hasOnlyDefaultMember, isRelativeModule, not(member(startsWithAlphanumeric))), sort: moduleName(unicode) },
    // import _, * as bar from "./baz";
    // { match: and(hasDefaultMember, hasNamespaceMember, isRelativeModule, not(member(startsWithAlphanumeric))), sort: moduleName(unicode) },
    // import _, {bar, …} from "./baz";
    // { match: and(hasDefaultMember, hasNamedMembers, isRelativeModule, not(member(startsWithAlphanumeric))), sort: moduleName(unicode), sortNamedMembers: name(unicode) },
    {
      match: and(hasDefaultMember, isRelativeModule, not(member(startsWithAlphanumeric))),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },

    // import Foo from "./bar";
    // {match: and(hasOnlyDefaultMember, isRelativeModule, member(startsWithUpperCase)), sort: moduleName(unicode)},
    // import Foo, * as bar from "./baz";
    // {match: and(hasDefaultMember, hasNamespaceMember, isRelativeModule, member(startsWithUpperCase)), sort: moduleName(unicode)},
    // import Foo, {bar, …} from "./baz";
    // {match: and(hasDefaultMember, hasNamedMembers, isRelativeModule, member(startsWithUpperCase)), sort: moduleName(unicode), sortNamedMembers: name(unicode)},
    {
      match: and(hasDefaultMember, isRelativeModule, member(startsWithUpperCase)),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },

    { separator: true },

    // import foo from "./bar";
    // { match: and(hasOnlyDefaultMember, isRelativeModule, member(startsWithLowerCase)), sort: moduleName(unicode) },
    // import foo, * as bar from "./baz";
    // { match: and(hasDefaultMember, hasNamespaceMember, isRelativeModule, member(startsWithUpperCase)), sort: moduleName(unicode) },
    // import foo, {bar, …} from "./baz";
    // { match: and(hasDefaultMember, hasNamedMembers, isRelativeModule, member(startsWithLowerCase)), sort: moduleName(unicode), sortNamedMembers: name(unicode) },
    {
      match: and(hasDefaultMember, isRelativeModule, member(startsWithLowerCase)),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },

    { separator: true },

    // import * as _ from "./bar";
    {
      match: and(hasOnlyNamespaceMember, isRelativeModule, not(member(startsWithAlphanumeric))),
      sort: moduleName(unicode),
    },
    // import * as Foo from "./bar";
    { match: and(hasOnlyNamespaceMember, isRelativeModule, member(startsWithUpperCase)), sort: moduleName(unicode) },
    // import * as foo from "./bar";
    { match: and(hasOnlyNamespaceMember, isRelativeModule, member(startsWithLowerCase)), sort: moduleName(unicode) },

    { separator: true },

    // import {_, bar, …} from "./baz";
    {
      match: and(hasOnlyNamedMembers, isRelativeModule, not(member(startsWithAlphanumeric))),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },
    // import {Foo, bar, …} from "./baz";
    {
      match: and(hasOnlyNamedMembers, isRelativeModule, member(startsWithUpperCase)),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },
    // import {foo, bar, …} from "./baz";
    {
      match: and(hasOnlyNamedMembers, isRelativeModule, member(startsWithLowerCase)),
      sort: moduleName(unicode),
      sortNamedMembers: name(unicode),
    },

    { separator: true },

    // import "./foo"
    { match: and(hasNoMember, isRelativeModule) },

    { separator: true },
  ];
}
