/* @license Enterprise */

import { Link } from 'react-router-dom';

import { SettingsPath } from 'twenty-shared/types';

import { SettingsCard } from '@/settings/components/SettingsCard';
import { SettingsSSOIdentitiesProvidersListCardWrapper } from '@/settings/security/components/SSO/SettingsSSOIdentitiesProvidersListCardWrapper';
import { SSOIdentitiesProvidersState } from '@/settings/security/states/SSOIdentitiesProvidersState';
import { useSnackBarOnQueryError } from '@/apollo/hooks/useSnackBarOnQueryError';
import { useEffect } from 'react';
import { useLingui } from '@lingui/react/macro';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { getSettingsPath } from 'twenty-shared/utils';
import { IconKey } from 'twenty-ui/display';
import { useQuery } from '@apollo/client/react';
import { GetSsoIdentityProvidersDocument } from '~/generated-metadata/graphql';

export const SettingsSSOIdentitiesProvidersListCard = () => {
  const { t } = useLingui();

  const [SSOIdentitiesProviders, setSSOIdentitiesProviders] = useAtomState(
    SSOIdentitiesProvidersState,
  );

  const {
    loading,
    data: ssoData,
    error: ssoError,
  } = useQuery(GetSsoIdentityProvidersDocument, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (ssoData) {
      setSSOIdentitiesProviders(ssoData?.getSSOIdentityProviders ?? []);
    }
  }, [ssoData, setSSOIdentitiesProviders]);

  useSnackBarOnQueryError(ssoError);

  return loading || !SSOIdentitiesProviders.length ? (
    <Link to={getSettingsPath(SettingsPath.NewSSOIdentityProvider)}>
      <SettingsCard
        title={t`Add SSO Identity Provider`}
        Icon={<IconKey />}
      />
    </Link>
  ) : (
    <SettingsSSOIdentitiesProvidersListCardWrapper />
  );
};
