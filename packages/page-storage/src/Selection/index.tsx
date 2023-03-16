// Copyright 2017-2023 @polkadot/app-storage authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParitalQueryTypes, QueryTypes } from '../types.js';

import React, { useCallback, useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Consts from './Consts.js';
import Modules from './Modules.js';
import Raw from './Raw.js';

interface Props {
  basePath: string;
  onAdd: (query: QueryTypes) => void;
}

let id = -1;

function Selection ({ basePath, onAdd }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'modules',
      text: t<string>('Storage')
    },
    {
      name: 'constants',
      text: t<string>('Constants')
    },
    {
      name: 'raw',
      text: t<string>('Raw storage')
    }
  ]);

  const _onAdd = useCallback(
    (query: ParitalQueryTypes) => onAdd({ ...query, id: ++id }),
    [onAdd]
  );

  return (
    <>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Switch>
        <Route path={`${basePath}/constants`}><Consts onAdd={_onAdd} /></Route>
        <Route path={`${basePath}/raw`}><Raw onAdd={_onAdd} /></Route>
        <Route><Modules onAdd={_onAdd} /></Route>
      </Switch>
    </>
  );
}

export default React.memo(Selection);
