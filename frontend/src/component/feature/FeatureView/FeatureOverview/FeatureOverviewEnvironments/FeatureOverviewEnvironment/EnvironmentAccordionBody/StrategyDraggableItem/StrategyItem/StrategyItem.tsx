import { DragEventHandler, FC } from 'react';
import { Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { IFeatureEnvironment } from 'interfaces/featureToggle';
import { IFeatureStrategy } from 'interfaces/strategy';
import PermissionIconButton from 'component/common/PermissionIconButton/PermissionIconButton';
import { UPDATE_FEATURE_STRATEGY } from 'component/providers/AccessProvider/permissions';
import { formatEditStrategyPath } from 'component/feature/FeatureStrategy/FeatureStrategyEdit/FeatureStrategyEdit';
import { FeatureStrategyRemove } from 'component/feature/FeatureStrategy/FeatureStrategyRemove/FeatureStrategyRemove';
import { useRequiredPathParam } from 'hooks/useRequiredPathParam';
import { StrategyExecution } from './StrategyExecution/StrategyExecution';
import { ConditionallyRender } from 'component/common/ConditionallyRender/ConditionallyRender';
import { CopyStrategyIconMenu } from './CopyStrategyIconMenu/CopyStrategyIconMenu';
import { StrategyItemContainer } from 'component/common/StrategyItemContainer/StrategyItemContainer';
import { DisableEnableStrategy } from './DisableEnableStrategy/DisableEnableStrategy';
import useUiConfig from 'hooks/api/getters/useUiConfig/useUiConfig';

interface IStrategyItemProps {
    environmentId: string;
    strategy: IFeatureStrategy;
    onDragStart?: DragEventHandler<HTMLButtonElement>;
    onDragEnd?: DragEventHandler<HTMLButtonElement>;
    otherEnvironments?: IFeatureEnvironment['name'][];
    orderNumber?: number;
    headerChildren?: JSX.Element[] | JSX.Element;
}

export const StrategyItem: FC<IStrategyItemProps> = ({
    environmentId,
    strategy,
    onDragStart,
    onDragEnd,
    otherEnvironments,
    orderNumber,
    headerChildren,
}) => {
    const { uiConfig } = useUiConfig();
    const projectId = useRequiredPathParam('projectId');
    const featureId = useRequiredPathParam('featureId');

    const editStrategyPath = formatEditStrategyPath(
        projectId,
        featureId,
        environmentId,
        strategy.id
    );

    return (
        <StrategyItemContainer
            strategy={strategy}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            orderNumber={orderNumber}
            actions={
                <>
                    {headerChildren}
                    <ConditionallyRender
                        condition={Boolean(
                            otherEnvironments && otherEnvironments?.length > 0
                        )}
                        show={() => (
                            <CopyStrategyIconMenu
                                environmentId={environmentId}
                                environments={otherEnvironments as string[]}
                                strategy={strategy}
                            />
                        )}
                    />
                    <PermissionIconButton
                        permission={UPDATE_FEATURE_STRATEGY}
                        environmentId={environmentId}
                        projectId={projectId}
                        component={Link}
                        to={editStrategyPath}
                        tooltipProps={{
                            title: 'Edit strategy',
                        }}
                        data-testid={`STRATEGY_EDIT-${strategy.name}`}
                    >
                        <Edit />
                    </PermissionIconButton>
                    <ConditionallyRender
                        condition={Boolean(
                            uiConfig?.flags?.strategyImprovements
                        )}
                        show={() => (
                            <DisableEnableStrategy
                                projectId={projectId}
                                featureId={featureId}
                                environmentId={environmentId}
                                strategy={strategy}
                            />
                        )}
                    />
                    <FeatureStrategyRemove
                        projectId={projectId}
                        featureId={featureId}
                        environmentId={environmentId}
                        strategyId={strategy.id}
                        icon
                    />
                </>
            }
        >
            <StrategyExecution strategy={strategy} />
        </StrategyItemContainer>
    );
};
