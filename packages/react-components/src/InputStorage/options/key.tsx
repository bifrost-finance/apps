// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageEntry } from '@polkadot/types/primitive/types';
import type { DropdownOption, DropdownOptions } from '../../util/types';

import React from 'react';

import { ApiPromise } from '@polkadot/api';
import { unwrapStorageType } from '@polkadot/types/primitive/StorageKey';

export default function createOptions (api: ApiPromise, sectionName: string): DropdownOptions {
  const section = api.query[sectionName];

  if (!section || Object.keys(section).length === 0) {
    return [];
  }

  return Object
    .keys(section)
    .sort()
    .map((value): DropdownOption => {
      const { meta: { docs, modifier, name, type } } = section[value] as unknown as StorageEntry;
      const output = unwrapStorageType(api.registry, type, modifier.isOptional);
      let input = '';

      if (type.isMap) {
        const { hashers, key } = type.asMap;

        if (hashers.length === 1) {
          input = api.registry.lookup.getTypeDef(key).type;
        } else {
          const si = api.registry.lookup.getSiType(key).def;

          if (si.isTuple) {
            input = si.asTuple
              .map((t) => api.registry.lookup.getTypeDef(t).type)
              .join(', ');
          } else {
            input = si.asHistoricMetaCompat.toString();
          }
        }
      }

      return {
        className: 'ui--DropdownLinked-Item',
        key: `${sectionName}_${value}`,
        text: [
          <div
            className='ui--DropdownLinked-Item-call'
            key={`${sectionName}_${value}:call`}
          >
            {value}({input}): {output}
          </div>,
          <div
            className='ui--DropdownLinked-Item-text'
            key={`${sectionName}_${value}:text`}
          >
            {(docs[0] || name).toString()}
          </div>
        ],
        value
      };
    });
}
